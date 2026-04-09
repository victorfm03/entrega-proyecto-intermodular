const sequelize = require('sequelize');

module.exports=function(sequelize,DataTypes){
    return sequelize.define('Comentario',{
        idcomentario:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        idusuario:{
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'usuario',
                key: 'idusuario'
            },
            onDelete: 'CASCADE'
        },
        idrespuesta:{
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'comentario',
                key: 'idcomentario'
            },
            onDelete: 'CASCADE'
        },
        idobra:{
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'obra',
                key: 'idobra'
            },
            onDelete: 'CASCADE'
        },
        fechapublicacion:{
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW
        },
        texto:{
            type: DataTypes.STRING(350),
            allowNull: false
        },
        likes:{
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0
        }
    },{
        tableName: "comentario",
        timestamps: false,
        indexes:[
            {
            name: "PRIMARY",
            unique:true,
            using:"BTREE",
            fields:[
                {name:"idcomentario"}
            ]
        }
        ]
    });
};