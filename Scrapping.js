const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();
const cors = require('cors');

const PORT = process.env.PORT || 5000;
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/get-data/', (req, res) => {
    const { surcursal } = req.query.area;
    let url_base = `https://maxiconsumo.com/sucursal_capital/${surcursal}`;
    axios.get(url_base).then(response => {

        const html = response.data;
        const $ = cheerio.load(html);

        let data = [];
        let nombre_producto = '';
        let precio_producto = '';
        let objeto_producto = '';

        $('div', '.product.details.product-item-details.box-info').each((index, element) => {
            let nombre = ($(element).find('h2.product.name.product-item-name.product-name').text().trim());
            let precio = ($(element).find('span.price').text().trim());
            precio = precio.slice(0, 7);
            if (nombre != '') {
                nombre_producto = nombre;
            }
            if (precio != '') {
                precio_producto = precio;
                objeto_producto = { 'nombre': nombre_producto, 'precio': precio_producto };
                data.push(objeto_producto);
            }
        });

        const set = new Set(data.map(item => JSON.stringify(item)));
        const resultados = [...set].map(item => JSON.parse(item));

        res.status(200).send(resultados);

    }).catch(error => {
        console.log(error);
    });
});



app.listen(PORT, () => {
    console.log("Servidor aperturado, puedes hacer las consultas:", PORT);
});