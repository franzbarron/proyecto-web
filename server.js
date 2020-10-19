// Use .env file for environment variables
require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const path = require('path');

const app = express();
app.set('view engine', 'hbs');
app.use(express.static('public'));

hbs.registerPartials(path.join(__dirname, 'views', 'partials'), (err) => {
  if (err) console.error(err);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});

app.get('/', (_, res) => {
  res.render('Login');
});

app.get('/home', (_, res) => {
  // placeholder data to send
  const data = {
    categories: [
      {
        name: 'Instalaciones',
        img: 'https://i.ytimg.com/vi/xQhEe-7ZuPc/hqdefault.jpg'
      },
      {
        name: 'lorem',
        img:
          'https://kat-wallpapers.ambientcat.com/Achtergronden-480-360/Huisdieren-Tricolor-kitten-81.jpg'
      },
      {
        name: 'ipsum',
        img:
          'https://kat-wallpapers.ambientcat.com/Achtergronden-480-360/Huisdieren-Tricolor-kitten-81.jpg'
      },
      {
        name: 'dolor',
        img:
          'https://kat-wallpapers.ambientcat.com/Achtergronden-480-360/Huisdieren-Tricolor-kitten-81.jpg'
      },
      {
        name: 'sit',
        img:
          'https://kat-wallpapers.ambientcat.com/Achtergronden-480-360/Huisdieren-Tricolor-kitten-81.jpg'
      }
    ]
  };
  res.render('home', data);
});

app.get('/category/:name', (req, res) => {
  const { name } = req.params;

  // placeholder data to send
  const instalaciones = [
    {
      name: 'Biblioteca',
      img:
        'https://tec.mx/sites/default/files/styles/crop_galeria_style/public/2018-08/BiblioTEC_Gal_1aniv%20(5).jpg?itok=rzGKh0lp',
      rating: '★★★★★'
    },
    {
      name: 'CETEC',
      img: 'https://i.ytimg.com/vi/Eiv1owoPsVY/maxresdefault.jpg',
      rating: '★★☆☆☆'
    },
    {
      name: 'Rectoría',
      img: 'https://tec.mx/sites/default/files/2018-12/mural-1920x1080_0.jpg',
      rating: '★★★★★'
    },
    {
      name: 'Centro de Congresos',
      img:
        'https://3dwarehouse.sketchup.com/warehouse/v1.0/publiccontent/c3dd6161-07a9-4ef5-b9bd-008c808a0fed',
      rating: '★★★★☆'
    }
  ];

  res.render('category', { name, instalaciones });
});
