import React from 'react'
import EditarProducto from './editarProducto'
const middle = {
  verticalAlign: 'middle'
}
const ml = require('../assets/images/ml.png')
const ms = require('../assets/images/ms.png')
const mapImg = {
  'MercadoLibre': ml,
  'MercadoShops': ms
}
export default (prod) => (
  <tr>
    <td><img src={prod.thumbnail.replace(/http/, 'https')} /></td>
    <td style={middle} ><h2><span className="label label-success">{prod.title}</span></h2></td>
    <td style={middle} onClick={prod.toggleEdit.bind(this, prod.id)}><h2><span className="text-info glyphicon glyphicon-pencil"></span></h2></td>
    <td> <EditarProducto isOpen={prod.edit} {...Object.assign({}, prod, { toggleEdit: prod.toggleEdit.bind(this, prod.id) }) } /> </td>
    <td><img src={mapImg[prod.origen]} /></td>
  </tr>

)