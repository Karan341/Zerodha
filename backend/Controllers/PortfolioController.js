const { HoldingsModel } = require("../Models/HoldingsModel");
const { OrdersModel } = require("../Models/OrdersModel");
const { PositionsModel } = require("../Models/PositionsModel");
const { WatchlistModel } = require("../Models/WatchlistModel");

const defaultSymbols = [
  "INFY",
  "ONGC",
  "TCS",
  "KPITTECH",
  "QUICKHEAL",
  "WIPRO",
  "M&M",
  "RELIANCE",
  "HUL",
];

const demoHoldings = [
  { name: "INFY", qty: 8, avg: 1420, price: 1555.45, net: "+9.54%", day: "-1.60%" },
  { name: "TCS", qty: 3, avg: 2980, price: 3194.8, net: "+7.21%", day: "-0.25%" },
  { name: "RELIANCE", qty: 5, avg: 2240, price: 2112.4, net: "-5.70%", day: "+1.44%" },
  { name: "HDFCBANK", qty: 6, avg: 1480, price: 1522.35, net: "+2.86%", day: "+0.11%" },
  { name: "ITC", qty: 20, avg: 198, price: 207.9, net: "+5.00%", day: "+0.80%" },
  { name: "WIPRO", qty: 12, avg: 610, price: 577.75, net: "-5.29%", day: "+0.32%" },
  { name: "ONGC", qty: 15, avg: 124, price: 116.8, net: "-5.81%", day: "-0.09%" },
  { name: "BHARTIARTL", qty: 4, avg: 538.05, price: 541.15, net: "+0.58%", day: "+2.99%" },
  { name: "KPITTECH", qty: 7, avg: 250.3, price: 266.45, net: "+6.45%", day: "+3.54%" },
];

const demoPositions = [
  { product: "MIS", name: "INFY", qty: 4, avg: 1532, price: 1555.45, net: "+1.53%", day: "+0.42%" },
  { product: "MIS", name: "TCS", qty: 2, avg: 3210, price: 3194.8, net: "-0.47%", day: "-0.25%" },
  { product: "CNC", name: "RELIANCE", qty: 3, avg: 2080, price: 2112.4, net: "+1.56%", day: "+1.44%" },
];

module.exports.GetHoldings = async (req, res) => {
  try {
    let holdings = await HoldingsModel.find({ userId: req.userId }).sort({
      _id: -1,
    });

    if (holdings.length === 0) {
      await HoldingsModel.insertMany(
        demoHoldings.map((holding) => ({
          ...holding,
          userId: req.userId,
          isDemo: true,
        }))
      );
      holdings = await HoldingsModel.find({ userId: req.userId }).sort({
        _id: -1,
      });
    }

    return res.json(holdings);
  } catch (error) {
    console.error("Could not load user holdings:", error);
    return res.status(500).json({ message: "Could not load holdings." });
  }
};

module.exports.GetPositions = async (req, res) => {
  try {
    let positions = await PositionsModel.find({ userId: req.userId }).sort({
      _id: -1,
    });
    if (positions.length === 0) {
      await PositionsModel.insertMany(
        demoPositions.map((position) => ({
          ...position,
          userId: req.userId,
          isLoss: (position.price - position.avg) * position.qty < 0,
          isDemo: true,
        }))
      );
      positions = await PositionsModel.find({ userId: req.userId }).sort({
        _id: -1,
      });
    }
    return res.json(positions);
  } catch (error) {
    console.error("Could not load user positions:", error);
    return res.status(500).json({ message: "Could not load positions." });
  }
};

module.exports.GetOrders = async (req, res) => {
  try {
    const orders = await OrdersModel.find({ userId: req.userId }).sort({
      createdAt: -1,
    });
    return res.json(orders);
  } catch (error) {
    console.error("Could not load user orders:", error);
    return res.status(500).json({ message: "Could not load order history." });
  }
};

module.exports.CreateOrder = async (req, res) => {
  const { name, qty, price, mode } = req.body;
  const quantity = Number(qty);
  const orderPrice = Number(price);
  const orderMode = typeof mode === "string" ? mode.toUpperCase() : "";

  if (
    typeof name !== "string" ||
    !name.trim() ||
    !Number.isFinite(quantity) ||
    quantity <= 0 ||
    !Number.isFinite(orderPrice) ||
    orderPrice <= 0 ||
    !["BUY", "SELL"].includes(orderMode)
  ) {
    return res.status(400).json({
      success: false,
      message: "Enter a valid instrument, quantity, price, and order type.",
    });
  }

  try {
    const order = await OrdersModel.create({
      userId: req.userId,
      name: name.trim().toUpperCase(),
      qty: quantity,
      price: orderPrice,
      mode: orderMode,
      status: "PLACED (SIMULATED)",
    });

    return res.status(201).json({
      success: true,
      message: "Simulated order saved to your order history.",
      order,
    });
  } catch (error) {
    console.error("Could not save user order:", error);
    return res.status(500).json({
      success: false,
      message: "Could not save the order.",
    });
  }
};

module.exports.GetWatchlist = async (req, res) => {
  try {
    const savedWatchlist = await WatchlistModel.findOne({
      userId: req.userId,
    }).lean();
    return res.json({
      symbols: savedWatchlist?.symbols ?? defaultSymbols,
    });
  } catch (error) {
    console.error("Could not load user watchlist:", error);
    return res.status(500).json({ message: "Could not load watchlist." });
  }
};

module.exports.SaveWatchlist = async (req, res) => {
  const { symbols } = req.body;
  if (
    !Array.isArray(symbols) ||
    symbols.length > 50 ||
    symbols.some(
      (symbol) => typeof symbol !== "string" || !/^[A-Z0-9&.-]{1,20}$/i.test(symbol)
    )
  ) {
    return res.status(400).json({
      message: "Watchlist must contain up to 50 valid stock symbols.",
    });
  }

  const normalizedSymbols = [...new Set(symbols.map((symbol) => symbol.trim().toUpperCase()))];
  try {
    const watchlist = await WatchlistModel.findOneAndUpdate(
      { userId: req.userId },
      { $set: { symbols: normalizedSymbols } },
      { new: true, upsert: true, runValidators: true }
    );
    return res.json({ symbols: watchlist.symbols });
  } catch (error) {
    console.error("Could not save user watchlist:", error);
    return res.status(500).json({ message: "Could not save watchlist." });
  }
};
