const Item = require("../models/itemSchema")
const Price = require("../models/priceStockSchema")

const fruits = [
    "apple", "banana", "orange", "mango", "grape", "pineapple", "strawberry", "blueberry", "kiwi", "watermelon",
    "pear", "peach", "cherry", "plum", "raspberry", "blackberry", "apricot", "fig", "date", "pomegranate",
    "cantaloupe", "honeydew", "papaya", "guava", "lychee", "dragonfruit", "persimmon", "passionfruit", "nectarine", "cranberry",
    "tangerine", "coconut", "lime", "lemon", "grapefruit", "jackfruit", "durian", "mangosteen", "avocado", "olive",
    "quince", "starfruit", "rambutan", "mulberry", "gooseberry", "loganberry", "elderberry", "boysenberry", "currant", "cloudberry",
    "kumquat", "soursop", "ackee", "breadfruit", "sapodilla", "jabuticaba", "longan", "salak", "tamarind", "medlar",
    "miraclefruit", "carambola", "acerola", "buddha's hand", "ugli fruit", "rose apple", "surinam cherry", "white currant", "blackcurrant", "rowanberry",
    "marionberry", "huckleberry", "kiwano", "pineberry", "yuzu", "pomelo", "custard apple", "sugar apple", "sweetsop", "santol",
    "cupuacu", "lucuma", "pawpaw", "bilberry", "saskatoon berry", "jostaberry", "mamey sapote", "camucamu", "feijoa", "muscadine",
    "jaboticaba", "monstera", "safou", "naranjilla", "jabuticaba", "langsat", "mamoncillo", "bacuri", "gac", "lucuma"
];

const vegetables = [
    "carrot", "broccoli", "cauliflower", "spinach", "kale", "lettuce", "cabbage", "potato", "sweet potato", "beetroot",
    "onion", "garlic", "tomato", "zucchini", "eggplant", "pepper", "cucumber", "pumpkin", "squash", "radish",
    "turnip", "parsnip", "celery", "fennel", "leek", "scallion", "shallot", "artichoke", "asparagus", "okra",
    "mushroom", "pea", "green bean", "snow pea", "snap pea", "lentil", "chickpea", "kidney bean", "black bean", "pinto bean",
    "butternut squash", "acorn squash", "spaghetti squash", "bell pepper", "chili pepper", "jalapeño", "habanero", "cayenne", "paprika", "horseradish",
    "ginger", "turmeric", "daikon", "bamboo shoot", "water chestnut", "lotus root", "yuca", "taro", "cassava", "yam",
    "collard greens", "mustard greens", "swiss chard", "bok choy", "arugula", "endive", "escarole", "radicchio", "watercress", "dandelion greens",
    "kohlrabi", "brussels sprouts", "rutabaga", "jicama", "salsify", "chayote", "tomatillo", "amaranth", "purslane", "malabar spinach",
    "fenugreek", "moringa", "cress", "sorrel", "nettles", "beet greens", "turnip greens", "radish greens", "dill", "cilantro",
    "parsley", "basil", "oregano", "thyme", "rosemary", "mint", "sage", "lavender", "chive", "bay leaf"
];


const createItem = async (req, res) => {
    const itemData = { name: req.body.name, creator: req.body.creator }
    try {
        const newItem = await Item.create(itemData)
        const priceChange = { price: req.body.price, stock: req.body.stock, date: req.body.date, itemId: newItem._id }
        Price.create(priceChange)
        res.status(200)
            .send({
                error: false,
                message: "item created"
            })
    } catch (error) {
        console.log("error while creating item")
        res.status(500)
            .send({
                error: true,
                message: err.message
            })
    }
}

const getItems = async (req, res) => {
    try {
        const dateString = req.headers['x-selected-date'];
        let responseSent = false; // Flag to track if a response has been sent       

        if (dateString !== '') {
            const items = await Item.find({ creator: req.body.creator });
            const modifiedItems = await Promise.all(items.map(async (item) => {
                const dataByDate = await getPriceStockDataByDate(item, dateString);
                return {
                    id: item._id,
                    name: item.name,
                    stock:dataByDate.stock,
                    price:dataByDate.price
                };
            }));
            
            const filteredItems = modifiedItems.filter(item => item.stock !== 0);
            filteredItems.sort((a, b) => a.price - b.price);

            if (!responseSent) {
                res.status(200).json(filteredItems);
                responseSent = true;
                return; // Exit early to prevent further code execution
            }
        }

        // Fetch items and compute additional metrics
        const items = await Item.find({ creator: req.body.creator });
        let totalStock = 0;
        let fruitsCount = 0;
        let vegetableCount = 0;
        let leafyvegetablesCounts = 0;
        const modifiedItems = await Promise.all(items.map(async (item) => {
            const priceStockData = await getpriceStockData(item);
            const stock = parseInt(priceStockData.stock, 10);
            totalStock += stock;

            if (fruits.includes(item.name.toLowerCase())) {
                fruitsCount += stock;
            } else if (vegetables.includes(item.name.toLowerCase())) {
                vegetableCount += stock;
            } else {
                leafyvegetablesCounts += stock;
            }

            return {
                id: item._id,
                name: item.name,
                stock,
                price: priceStockData.price
            };
        }));

        const filteredItems = modifiedItems.filter(item => item.stock !== 0);

        if (filteredItems.length === 0) {
            await Promise.all(items.map(async (item) => {
                await getAndSetPreviousPriceStockData(item);
            }));
        }

        filteredItems.sort((a, b) => a.price - b.price);

        let changeInStockPercentage = 0;

        try {
            changeInStockPercentage = await evaluateStockChange(items, totalStock);
            changeInStockPercentage = parseFloat(changeInStockPercentage.toFixed(2));
        } catch (error) {
            console.error('Error evaluating stock change:', error);
        }

        const counts = {
            totalStock,
            fCount: fruitsCount,
            vCount: vegetableCount,
            lCount: leafyvegetablesCounts,
            SCpercentage: changeInStockPercentage
        };

        if (!responseSent) {
            const itemWithStock = { filteredItems, counts };
            res.status(200).json(itemWithStock);
        }
    } catch (error) {
        console.error('Error fetching items:', error); // Log the error
        if (!responseSent) {
            res.status(500).json({ message: 'Error fetching items', error }); // Send error response
        }
    }
};

const getpriceStockData = async (item) => {

    try{
        const particularPriceStockDataArray = await Price.find({ itemId: item._id });

        const today = new Date().toLocaleDateString('en-GB').split('/').join('-'); // 'dd-mm-yyyy'
    
        const todayData = particularPriceStockDataArray.filter(data => {
            const itemDate = data.date.split(' ')[0]; 
            return itemDate === today;
        });
    
        if (todayData.length === 0) {
            return { stock: 0, price: 0 }; // No data for today
        }
    
    
        // Sort the filtered data by time in descending order
        todayData.sort((a, b) => {
            // Convert 'dd-mm-yyyy hh:mm' to 'yyyy-mm-ddThh:mm' for Date parsing
            const dateA = new Date(a.date.split(' ')[0].split('-').reverse().join('-') + 'T' + a.date.split(' ')[1]).getTime();
            const dateB = new Date(b.date.split(' ')[0].split('-').reverse().join('-') + 'T' + b.date.split(' ')[1]).getTime();
    
            return dateB - dateA; // Sort in descending order (most recent first)
        });
        // The first item in the sorted array is the most recent
        const latestData = todayData[0];
    
        return { stock: latestData.stock, price: latestData.price };
    } catch (error) {
        console.error('Error fetching items:', error); // Log the error
        res.status(500).json({ message: 'Error in getpriceStockData', error }); // Send error response
    }

};


const getPreviousPriceStockData = async (item) => {

    try{
        const particularPriceStockDataArray = await Price.find({ itemId: item._id });

        // Calculate yesterday's date in dd-mm-yyyy format
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const formattedYesterday = yesterday.toLocaleDateString("en-GB").split("/").join("-");
    
        // Filter entries for yesterday
        const yesterdayData = particularPriceStockDataArray.filter(data => {
            const itemDate = data.date.split(" ")[0]; // Extract 'dd-mm-yyyy'
            return itemDate === formattedYesterday;
        });
    
        if (yesterdayData.length === 0) {
            return { stock: 0, price: 0 };; // No data for yesterday
        }
    
        // Sort the filtered data by time in descending order to get the latest
        yesterdayData.sort((a, b) => {
            const timeA = new Date(a.date.split(" ")[0].split("-").reverse().join("-") + 'T' + a.date.split(" ")[1]).getTime();
            const timeB = new Date(b.date.split(" ")[0].split("-").reverse().join("-") + 'T' + b.date.split(" ")[1]).getTime();
            return timeB - timeA; // Most recent time first
        });
    
        // The first element in the sorted array is the latest data for yesterday
        const latestYesterdayData = yesterdayData[0];
    
        return { stock: latestYesterdayData.stock, price: latestYesterdayData.price };
    } catch (error) {
        console.error('Error:', error); // Log the error
        res.status(500).json({ message: 'Error in getPreviousPriceStockData', error }); // Send error response
    }
  
};

const getPriceStockDataByDate = async (item, date) => {
    try {
            // Ensure date is in dd-mm-yyyy format
    const formattedDate = date; // e.g., '13-08-2024'

    // Find all price stock data for the specific item
    const particularPriceStockDataArray = await Price.find({ itemId: item._id });

    // Filter entries for the provided date
    const filteredData = particularPriceStockDataArray.filter(data => {
        // Extract date from data
        const itemDate = data.date.split(" ")[0]; // Extract 'dd-mm-yyyy'
        return itemDate === formattedDate;
    });

    if (filteredData.length === 0) {
        return { stock: 0, price: 0 }; // No data for the provided date
    }

    // Sort the filtered data by time in descending order to get the latest
    filteredData.sort((a, b) => {
        // Convert 'dd-mm-yyyy HH:mm' to a sortable format
        const timeA = new Date(a.date.split(" ")[0].split("-").reverse().join("-") + 'T' + a.date.split(" ")[1]).getTime();
        const timeB = new Date(b.date.split(" ")[0].split("-").reverse().join("-") + 'T' + b.date.split(" ")[1]).getTime();
        return timeB - timeA; // Most recent time first
    });

    // The first element in the sorted array is the latest data for the provided date
    const latestData = filteredData[0];

    return { stock: latestData.stock, price: latestData.price };
    } catch (error) {
        res.status(500).json({ message: 'Error in getPriceStockDataByDate', error }); // Send error response
    }
};



const getPreviousDateData = async (item) => {
    try {
        const particularPriceStockDataArray = await Price.find({ itemId: item._id });

        // Calculate yesterday's date in dd-mm-yyyy format
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const formattedYesterday = yesterday.toLocaleDateString("en-GB").split("/").join("-");
    
        // Filter entries for yesterday
        const yesterdayData = particularPriceStockDataArray.filter(data => {
            const itemDate = data.date.split(" ")[0]; // Extract 'dd-mm-yyyy'
            return itemDate === formattedYesterday;
        });
    
        if (yesterdayData.length === 0) {
            return { stock: 0, price: 0 };; // No data for yesterday
        }
    
        // Sort the filtered data by time in descending order to get the latest
        yesterdayData.sort((a, b) => {
            const timeA = new Date(a.date.split(" ")[0].split("-").reverse().join("-") + 'T' + a.date.split(" ")[1]).getTime();
            const timeB = new Date(b.date.split(" ")[0].split("-").reverse().join("-") + 'T' + b.date.split(" ")[1]).getTime();
            return timeB - timeA; // Most recent time first
        });
    
        // The first element in the sorted array is the latest data for yesterday
        const latestYesterdayData = yesterdayData[0];
    
        return { stock: latestYesterdayData.stock, price: latestYesterdayData.price };
    } catch (error) {
        res.status(500).json({ message: 'Error in getPreviousDateData', error }); // Send error response
    }
};

const getFormattedDate = () => {
    try {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0'); // January is 0!
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
    
        return `${day}-${month}-${year} ${hours}:${minutes}`;
    } catch (error) {
        res.status(500).json({ message: 'Error in getFormattedDate', error }); // Send error response
    }
};


const getAndSetPreviousPriceStockData = async (item) => {
    try {
        const particularPriceStockDataArray = await Price.find({ itemId: item._id });

        // Calculate yesterday's date in dd-mm-yyyy format
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const formattedYesterday = yesterday.toLocaleDateString("en-GB").split("/").join("-");
    
        // Filter entries for yesterday
        const yesterdayData = particularPriceStockDataArray.filter(data => {
            const itemDate = data.date.split(" ")[0]; // Extract 'dd-mm-yyyy'
            return itemDate === formattedYesterday;
        });
    
        if (yesterdayData.length === 0) {
            return { stock: 0, price: 0 };; // No data for yesterday
        }
    
        // Sort the filtered data by time in descending order to get the latest
        yesterdayData.sort((a, b) => {
            const timeA = new Date(a.date.split(" ")[0].split("-").reverse().join("-") + 'T' + a.date.split(" ")[1]).getTime();
            const timeB = new Date(b.date.split(" ")[0].split("-").reverse().join("-") + 'T' + b.date.split(" ")[1]).getTime();
            return timeB - timeA; // Most recent time first
        });
    
        // The first element in the sorted array is the latest data for yesterday
        const latestYesterdayData = yesterdayData[0];
        const priceChange = { price: latestYesterdayData.price, stock: latestYesterdayData.stock, date: getFormattedDate(), itemId: item._id }
        await Price.create(priceChange)
    } catch (error) {
        res.status(500).json({ message: 'Error in getAndSetPreviousPriceStockData', error }); // Send error response
    }
};

const evaluateStockChange = async (items, totalStock) => {
    try {
        let previousPriceStockData = {}
        let previousTotalStock = 0
        let previousFruitsCount = 0
        let previousVegetablesCount = 0
        let previousLeafyvegetablesCounts = 0
        let percentageOfStockChange = 0
        let previousStock = 0
    
        await Promise.all(items.map(async (item) => {
    
            previousPriceStockData = await getPreviousPriceStockData(item);
            if (previousPriceStockData) {
                previousStock = parseInt(previousPriceStockData.stock, 10);
                previousTotalStock += previousStock;
            }
    
            if (fruits.includes(item.name.toLowerCase())) {
                previousFruitsCount += previousStock;
            } else if (vegetables.includes(item.name.toLowerCase())) {
                previousVegetablesCount += previousStock;
            } else {
                previousLeafyvegetablesCounts += previousStock;
            }
    
            percentageOfStockChange = calculatepercentageOfStockChange(totalStock, previousTotalStock)
    
        }));
        return percentageOfStockChange
    } catch (error) {
        res.status(500).json({ message: 'Error in evaluateStockChange', error }); // Send error response
    }
}

const calculatepercentageOfStockChange = (currentValue, previousValue) => {
    try {
        if (previousValue === 0) {
            return currentValue > 0 ? 100 : 0;
        }
        const change = ((currentValue - previousValue) / previousValue) * 100;
        return change;
    } catch (error) {
        res.status(500).json({ message: 'Error in calculatepercentageOfStockChange', error }); // Send error response
    }
}


const deleteItems = async (req, res) => {
    try {
        await Price.deleteMany({ itemId: req.headers.id })
        await Item.findByIdAndDelete(req.headers.id); // Fetch all items using Mongoose
        res.status(200).send({
            error: false,
            message: "item deleted"
        });
    } catch (error) {
        console.error('Error fetching items:', error); // Log the error
        res.status(500).json({ message: 'Error fetching items', error }); // Send error response
    }
}

const updateItem = async (req, res) => {
    const name = req.body.name
    const priceBody = { stock: req.body.stock, price: req.body.price, date: req.body.date, itemId: req.headers.id, newItem: false }
    try {
        await Item.findByIdAndUpdate(
            req.headers.id,
            { name: name },
            { new: true }
        );
        await Price.create(priceBody)
        res.status(200).json({ error: false, message: "items updated" })
    } catch (error) {
        res.status(500).json({ message: "Item is not updated" })
    }
}

module.exports = { createItem, getItems, deleteItems, updateItem }