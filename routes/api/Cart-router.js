const { Router } = require("express")
const fs = require("fs/promises");

const CartsManager = require("../../managers/CartsManager.js");
const cartsManager = new CartsManager("cart.json");

const router = Router();

router.get("/:cid", async (req, res) => {
  const id = parseInt(req.params.cid);
  const cart = await cartsManager.getById(id);

  if (!cart) {
    res.status(404).send("No se encuentra un carrito de compras con el identificador proporcionado");
    return;
  } else if (cart.products.length === 0) {
    res.status(201).send("Este carrito no contiene productos seleccionados");
  } else {
    res.status(201).send(cart.products);
  }
});

router.get("/", async (req, res) => {
  const carts = await cartsManager.getAll();
  res.send(carts);
});

router.post("/", async (req, res) => {
  const { body } = req;
  const cart = await cartsManager.create(body);
  res.status(201).send(cart);
});

router.post('/:cid/product/:pid', async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;

  try {
    let data = await fs.readFile('./data/cart.json', 'utf-8');
    let cartList = JSON.parse(data);

    const cartIndex = cartList.findIndex((item) => item.cid === cid);

    if (cartIndex !== -1) {
      const cart = cartList[cartIndex];
      const existingProductIndex = cart.products.findIndex((item) => item.product === pid);

      if (existingProductIndex !== -1) {
      
        cart.products[existingProductIndex].quantity++;
      } else {
    
        const newProductId = cart.products.length + 1;
        const newProduct = { id: newProductId, product: pid, quantity: 1 };
        cart.products.push(newProduct);
      }
    } else {
      
      const newProduct = { id: 1, product: pid, quantity: 1 };
      const newCart = { cid, products: [newProduct] };
      cartList.push(newCart);
    }

    data = JSON.stringify(cartList, null, 2);
    await fs.writeFile('./data/cart.json', data, 'utf-8');

    res.json(cartList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar el producto al carrito' });
  }
});




module.exports = router;
