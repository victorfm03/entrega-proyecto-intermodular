const { Sequelize } = require("sequelize")

module.exports=function(sequelize,DataTypes){

    return sequelize.define("obra_traducciones",{

        obra_id:{
            primaryKey:true,
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'obra',
                key: 'idobra'
            },
            onDelete: 'CASCADE'
        },
        id_traduccion: {

            type: DataTypes.INTEGER,
            allowNull:false,
            primaryKey:true,
            autoIncrement: true

        },
        idioma:{
            type: DataTypes.STRING(45),
            allowNull: true
        },
        titulo:{
            type: DataTypes.STRING(1000),
            allowNull: false
        },

    },

{
    tableName:"obra_traducciones",
    timestamps: false,
    indexes:[
        {
            name: "PRIMARY",
            unique:true,
            using:"BTREE",
            fields:[
                {name:"obra_id"},{name:"id_traduccion"}
            ]
        }
    ]
})

}