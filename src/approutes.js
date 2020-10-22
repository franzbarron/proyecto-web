const express = require('express');

const router = express.Router();

// ===Other files===
const dbController = require('./dbcontroller');

const db = new dbController();

const isLoggedIn = (req, res, next) => {
  if (req.user) next();
  else res.redirect('/');
};

router.get('/', (_, res) => {
  res.render('login');
});

router.get('/home', isLoggedIn, (_, res) => {
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

router.get('/category/:name', (req, res) => {
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

router.get('/profile', isLoggedIn, (req, res) => {
  //const { name } = req.params;
  const data = {
    name: 'Paola Rijo',
    email: 'masiel.107@gamil.com',
    campus: 'Monterrey',
    history: [
      {
        reviewname: 'Servilletero',
        rating: '★★★★★'
      },
      {
        reviewname: 'Dona tota',
        rating: '★★★★☆'
      },
      {
        reviewname: 'Chilaquiles tec',
        rating: '★★☆☆☆'
      },
      {
        reviewname: 'Mitec',
        rating: '★★★★☆'
      },
      {
        reviewname: 'Mode hibrido',
        rating: '★★☆☆☆'
      }
    ],
    img:
      'https://3dwarehouse.sketchup.com/warehouse/v1.0/publiccontent/c3dd6161-07a9-4ef5-b9bd-008c808a0fed'
  };
  res.render('profile', data);
});

router.get('/review/:name', (req, res) => {
  const { name } = req.params;

  // Placeholder data to send
  const data = {
    name,
    image:
      'https://tec.mx/sites/default/files/styles/crop_galeria_style/public/2018-08/BiblioTEC_Gal_1aniv%20(5).jpg?itok=rzGKh0lp',
    rating: '★★★★★',
    'total-reviews': 70,
    reviews: [
      {
        name: 'Alex Palmer',
        rating: '★★★★★',
        comment:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut dictum felis odio. Cras volutpat mauris quis purus ullamcorper mollis. Nulla eleifend lorem quis massa cursus sagittis. Integer imperdiet lorem elit. Nunc dictum, enim eget vehicula molestie, ex ante euismod odio, a vulputate metus velit id dolor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Quisque auctor lacus tortor. Aenean eget dolor fringilla, commodo tortor ut, ultricies massa. Integer ut efficitur risus.'
      },
      {
        name: 'Gerald Walton',
        rating: '★★★★★',
        comment:
          'Integer imperdiet magna vel vehicula tincidunt. Aliquam erat volutpat. Morbi dui nibh, ultricies in sem in, auctor congue dui. Mauris nec tortor in ante sagittis congue ac at nibh. Fusce erat mi, cursus et varius eget, fringilla at orci. Cras nec enim vehicula, facilisis erat vel, porta urna. Cras eget sodales ex, eu elementum velit. Cras viverra metus cursus viverra blandit. Pellentesque posuere dui nulla, semper pharetra libero tempor at. Integer posuere massa et ante tristique, eget vulputate turpis tincidunt. Integer aliquam posuere tristique. Vestibulum eu neque lectus. Integer varius suscipit nulla sit amet gravida. Aliquam nec enim eleifend, fringilla nunc in, vestibulum sem.'
      },
      {
        name: 'Rosa Mendez',
        rating: '★★★★★',
        comment:
          'Integer efficitur volutpat vehicula. Interdum et malesuada fames ac ante ipsum primis in faucibus. Quisque eu libero nulla. Aenean ultricies libero ac blandit ultrices. Aenean pharetra leo risus, consectetur ullamcorper velit tincidunt sit amet. Fusce et tellus vel ligula semper maximus id eu risus. Aenean in felis purus. Quisque facilisis lorem sit amet ex vehicula varius. Nam iaculis eget ex imperdiet ornare. Integer elementum urna et elit ultricies, ut sagittis ligula aliquet. Nullam et nibh tincidunt, suscipit tellus quis, tempus lectus. Nulla facilisi. Aliquam erat volutpat. '
      },
      {
        name: 'Lelia Wilkins',
        rating: '★★★★★',
        comment:
          'Mauris nec condimentum eros, a scelerisque tellus. Pellentesque nec neque malesuada, consequat risus a, bibendum augue. Phasellus ut tortor placerat ex ullamcorper porttitor ut sit amet sapien. Nunc cursus mauris vitae diam suscipit porta. Phasellus posuere vulputate nulla in imperdiet. Nulla eu tincidunt eros. Quisque sollicitudin vel lacus sit amet tristique. '
      },
      {
        name: 'Irene Lynch',
        rating: '★★★★★',
        comment:
          'Praesent finibus aliquam facilisis. Mauris aliquet, eros eu dapibus imperdiet, felis libero iaculis lorem, id rhoncus massa ligula eget ex. Nullam molestie quam arcu, eget venenatis tortor fermentum sodales. Curabitur sodales bibendum nibh sed accumsan. Fusce consectetur elit at ligula venenatis porttitor. Integer consequat felis at finibus hendrerit. Morbi turpis massa, facilisis eu leo sit amet, rutrum mollis ligula. Donec mollis pharetra porttitor. Ut vel risus scelerisque, tincidunt felis pellentesque, volutpat leo. Aenean eget elit congue, semper sapien et, rutrum ligula. Aliquam ante lorem, dictum quis ante a, facilisis porta dolor. Sed commodo consectetur ex eget faucibus. Fusce a laoreet sem, sed vehicula felis.'
      },
      {
        name: 'Elijah Murphy',
        rating: '★★★★★',
        comment:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut dictum felis odio. Cras volutpat mauris quis purus ullamcorper mollis. Nulla eleifend lorem quis massa cursus sagittis. Integer imperdiet lorem elit. Nunc dictum, enim eget vehicula molestie, ex ante euismod odio, a vulputate metus velit id dolor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Quisque auctor lacus tortor. Aenean eget dolor fringilla, commodo tortor ut, ultricies massa. Integer ut efficitur risus.'
      }
    ]
  };

  res.render('review', data);
});

module.exports = router;
