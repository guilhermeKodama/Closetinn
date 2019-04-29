import { ObjectID } from 'mongodb'
import Cloth from '/src/models/cloth'
import UnclassifiedCloth from '/src/models/unclassifiedCloth'

module.exports = {
  /**
  @api {get} /admin/unclassifiedClothes Get paginated and filtered unclasified clothes
  @apiVersion 0.0.1
  @apiName GetUnClassifiedClothes
  @apiGroup Admin
  @apiDescription
  Get unclassified clothes with pagination and filters

  @apiParam {Array} [offset]  Number of items per page (required).
  @apiParam {Number} [currentPage] current page (required).

  @apiSuccessExample {json} Success-Response:
  HTTP/1.1 200 OK
  {
    "pagination": {
        "currentPage": 1,
        "offset": 10,
        "totalPages": 94,
        "totalItems": 934
    },
    "unclassifiedClothes": [
        {
            "_id": "5a149bbcf32c593d17eec8f7",
            "description": "Bermuda Sarja Refined Bl-6991, feita em 98% algodão e 2% elastano. Possui lavagem color. Cintura média e cós com passantes para cinto. Conta com bolsos frontais com bolso menor e bolsos traseiros. Fecho em zíper e botão. Barra dobrada. Peso: 352g. Informação AdicionalComprimento Aproximado (Tamanho 44): 54cm.Pode haver variação de 2cm no comprimento de cada tamanho. Medidas do ModeloO modelo da foto detalhe usa tamanho 44 e possui as seguintes medidas: Altura 1,88m | Tórax 106cm | Cintura 87cm | Quadril 104cm | Peso: 90kg.",
            "title": "Bermuda Sarja Masculina Refined - Azul",
            "url": "http://www.passarela.com.br/produto/bermuda-sarja-masculina-refined-azul-6810037002-0",
            "gender": "masculino",
            "brand": null,
            "sizes": [
                "38",
                "40",
                "42",
                "44",
                "46",
                "48"
            ],
            "image_medium_url": "http://imagens.passarela.com.br/passarelaEstatico/imagens/produto/6810037002/6810037002_1_G.JPG",
            "images_urls": [
                "http://imagens.passarela.com.br/passarelaEstatico/imagens/produto/6810037002/6810037002_1_Z.JPG",
                "http://imagens.passarela.com.br/passarelaEstatico/imagens/produto/6810037002/6810037002_2_Z.JPG",
                "http://imagens.passarela.com.br/passarelaEstatico/imagens/produto/6810037002/6810037002_3_Z.JPG",
                "http://imagens.passarela.com.br/passarelaEstatico/imagens/produto/6810037002/6810037002_4_Z.JPG",
                "http://imagens.passarela.com.br/passarelaEstatico/imagens/produto/6810037002/6810037002_5_Z.JPG"
            ],
            "productName": "Bermuda Sarja Masculina Refined - Azul",
            "site": "passarela",
            "price": 79.99,
            "categories": [
                "Masculino",
                "Roupas"
            ]
        },
        {
            "_id": "5a149bc5f32c593c781de6bb",
            "description": "Short 'Grafitti' estampado branco, Le Lis Blanc. Possui cintura média, passantes no cós, cinco bolsos, estampa, detalhes puídos, barra desfiada e fechamento por botão e zíper.",
            "title": "Le Lis Blanc",
            "url": "https://www.farfetch.com/br/shopping/women/le-lis-blanc-short-grafitti-estampado-item-12507548.aspx?storeid=9688&from=1",
            "gender": "feminino",
            "brand": "le lis blanc",
            "sizes": [
                "36",
                "38",
                "40",
                "42",
                "44"
            ],
            "image_medium_url": "https://cdn-images.farfetch-contents.com/12/50/75/48/12507548_11793696_322.jpg",
            "images_urls": [
                "https://cdn-images.farfetch-contents.com/12/50/75/48/12507548_11793696_1000.jpg",
                "https://cdn-images.farfetch-contents.com/12/50/75/48/12507548_11793697_1000.jpg",
                "https://cdn-images.farfetch-contents.com/12/50/75/48/12507548_11793698_1000.jpg",
                "https://cdn-images.farfetch-contents.com/12/50/75/48/12507548_11793699_1000.jpg",
                "https://cdn-images.farfetch-contents.com/12/50/75/48/12507548_11793700_1000.jpg"
            ],
            "productName": "Short 'Grafitti' estampado",
            "site": "farfetch",
            "price": 359.9,
            "categories": [
                "Feminino",
                "Roupas"
            ]
        }
      ]
    }

  @apiErrorExample {String} 404 Not Found:
  HTTP/1.1 404 Not found
  Not Found
  */
  getUnclassifiedClothes: async(req, res, next) => {
    try {
      const offset = parseInt(req.query.offset)
      const currentPage = parseInt(req.query.currentPage)

      const unclassifiedClothes = await UnclassifiedCloth.find({})
      .sort( { _id: 1 } )
      .skip(currentPage === 1? 0 : (currentPage - 1) * offset)
      .limit(offset)

      const count = await UnclassifiedCloth.count({})

      const pages = count % offset > 0? parseInt(count / offset) + 1 : parseInt(count / offset)

      const pagination = {
        currentPage,
        offset,
        totalPages: parseInt(count / offset) < 1? 1 : pages,
        totalItems: count
      }

      return res.json({ pagination, unclassifiedClothes })
    } catch(error) {
      console.log('ERROR:', error)
      return res.status(500).json({ error: error && error.toString() })
    }
  },
  /**
    @api {put} /admin/unclassifiedClothes/:clothId Unclassified Cloth move and update
    @apiPermission user
    @apiVersion 1.0.0
    @apiName UnclassifiedClothMoveAndUpdate
    @apiGroup Admin
    @apiDescription
    Unclassified Cloth move and update
  **/
  updateUnclassifiedCloth: async(req, res, next) => {
    try {
      const { productId } = req.params
      const { moveToClothesCollection, ...cloth } = req.body

      let updatedCloth

      if(moveToClothesCollection) {
        await UnclassifiedCloth.findOneAndRemove({ _id: new ObjectID(productId) })
        updatedCloth = await Cloth.create(cloth)
      } else {
        updatedCloth = await UnclassifiedCloth.findOneAndUpdate({ _id: new ObjectID(productId) }, cloth)
      }

      return res.json({ ...updatedCloth.toJSON() })
    } catch(error) {
      return res.status(500).json({ error: error && error.toString() })
    }
  }
}
