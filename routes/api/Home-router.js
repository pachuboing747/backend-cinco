const {Router} = require ("express");
const ProductManager = require("../../managers/ProductManager");
const productManager = new ProductManager("productos.json")
const CartsManager = require ("../../managers/CartsManager")
const cartsManager = new CartsManager("cart.json")

const router = Router()



router.get("/", async (req, res)=>{

    const products = await productManager.getAll()
    res.render("home", {
        title: "Productos",
        products,
        style: "home"

    })
})

router.get("/carrito", async(req, res)=>{

    const carrito = await cartsManager.getAll()
    res.render("carrito", {
        title: "Carrito",
        carrito,
        style: "carrito"
    })
})

router.get("/realTimesProducts", async(req, res)=>{

    const products = await productManager.getAll()
    res.render("realTimesProducts", {
        title: "RealTimesProducts",
        products,
        style: "carrito"
    })
    
})

router.post("/realTimesProducts", async (req, res) => {
    try {
      const requestData = req.body;
      const response = { message: "Solicitud POST exitosa", data: requestData };
      res.status(200).json(response);
    } catch (error) {
    
      const errorMessage = "Ocurrió un error durante el procesamiento de la solicitud POST.";
      res.status(500).json({ error: errorMessage });
    }
});
  

module.exports = router;