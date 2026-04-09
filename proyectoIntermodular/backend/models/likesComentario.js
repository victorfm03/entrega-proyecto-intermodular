const { Sequelize } = require("sequelize")

module.exports=function(sequelize,DataTypes){

    return sequelize.define("likesComentario",{

        idUsuario:{
            primaryKey:true,
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'usuario',
                key: 'idUsuario'
            },
            onDelete: 'CASCADE'
        },
        idComentario: {

            type: DataTypes.INTEGER,
            allowNull:false,
            primaryKey:true,
            references: {
                model: 'comentario',
                key: 'idComentario'
            },
            onDelete: 'CASCADE'

        },
        leDioLike:{
            type: DataTypes.BOOLEAN,
            allowNull: false
        }

    },

{
    tableName:"likescomentario",
    timestamps: false,
    indexes:[
        {
            name: "PRIMARY",
            unique:true,
            using:"BTREE",
            fields:[
                {name:"idUsuario"},{name:"idComentario"}
            ]
        }
    ]
})

}