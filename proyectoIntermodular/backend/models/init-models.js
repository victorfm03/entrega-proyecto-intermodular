var DataTypes=require("sequelize").DataTypes;

const { FOREIGNKEYS } = require("sequelize/lib/query-types");
var _usuario=require("./usuario");

var _obra=require("./obra");
var _comentario = require("./comentario");
var _lista = require("./lista");
var _listaobra = require("./listaobra");
var _puntua = require("./puntua");
var _likesComentario=require("./likesComentario");
var _obraTraduccion = require("./obra_traduccion");

function initModels(sequelize){

    var usuario=_usuario(sequelize,DataTypes);
    var lista=_lista(sequelize,DataTypes);

    var obra=_obra(sequelize,DataTypes);

    var obra_traduccion = _obraTraduccion(sequelize, DataTypes);


    var comentario=_comentario(sequelize,DataTypes);
    var listaobra=_listaobra(sequelize,DataTypes);
    var likesComentario=_likesComentario(sequelize,DataTypes);

    var puntua=_puntua(sequelize,DataTypes);

    comentario.belongsTo(usuario,{as: "idusuario_usuario",foreignKey: "idusuario"})

    comentario.belongsTo(comentario,{as: "idrespuesta_comentario",foreignKey: "idrespuesta"})

    comentario.belongsTo(obra,{as: "idobra_obra",foreignKey: "idobra"})

    usuario.hasMany(comentario,{as: "comentarios",foreignKey: "idusuario"})

    comentario.hasMany(comentario,{as: "comentarios_comentarios",foreignKey: "idrespuesta"})

    obra.hasMany(comentario,{as: "comentarios",foreignKey: "idobra"})

    lista.belongsTo(usuario,{as: "idusuario_usuario",foreignKey: "idusuario"})

    usuario.hasMany(lista,{as: "listas",foreignKey: "idusuario"})

    listaobra.belongsTo(lista,{as: "idlista_lista",foreignKey: "idlista"})

    listaobra.belongsTo(obra,{as: "idobra_obra",foreignKey: "idobra"})

    lista.hasMany(listaobra,{as: "listaobras",foreignKey: "idlista"})

    obra.hasMany(listaobra,{as: "listaobras",foreignKey: "idobra"})

    puntua.belongsTo(usuario,{as: "idusuario_usuario",foreignKey: "idusuario"})

    puntua.belongsTo(obra,{as: "idobra_obra",foreignKey: "idobra"})

    usuario.hasMany(puntua,{as: "puntuas",foreignKey: "idusuario"})

    obra.hasMany(puntua,{as: "puntuas",foreignKey: "idobra"})

    likesComentario.belongsTo(usuario,{as: "idUsuario_usuario",foreignKey: "idUsuario"});
    likesComentario.belongsTo(comentario,{as: "idComentario_comentario",foreignKey: "idComentario"});
    usuario.hasMany(likesComentario,{as: "likesComentarios",foreignKey: "idUsuario"});
    comentario.hasMany(likesComentario,{as: "likesComentarios",foreignKey: "idComentario"});

    obra.hasMany(obra_traduccion, {as: "traducciones",foreignKey: "obra_id"});

    obra_traduccion.belongsTo(obra, {as: "obra",foreignKey: "obra_id"});

    return {usuario,obra,comentario,lista,listaobra,puntua,likesComentario,obra_traduccion};

}

module.exports=initModels;

module.exports.initModels=initModels;

module.exports.default=initModels;