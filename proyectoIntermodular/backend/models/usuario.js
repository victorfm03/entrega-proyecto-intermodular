const { Sequelize } = require("sequelize")

module.exports=function(sequelize,DataTypes){

    return sequelize.define("usuario",{

        idUsuario: {

            autoIncrement:true,
            type: DataTypes.INTEGER,
            allowNull:false,
            primaryKey:true

        },
        nombre:{
            type: DataTypes.STRING(45),
            allowNull:false
        },
        email:{
            type: DataTypes.STRING(90),
            allowNull:false,
            unique:true,
            validate:{
                isEmail:true
            }
        },
        biografia:{
            type: DataTypes.STRING(200),
            allowNull:true
        },
        contraseña:{
            type: DataTypes.STRING(90),
            allowNull:false
        },
        img_perfil:{
            type: DataTypes.BLOB('long'),
            allowNull:true
        },
        puntuacionquiz:{

            type: DataTypes.INTEGER,
            allowNull:false,
            defaultValue: 0
        },
        rol:{

            type: DataTypes.ENUM('cliente','administrador'),
            allowNull:false,
            defaultValue: 'cliente'
        },
        bloqueado:{
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        }


    },

{
    tableName:"usuario",
    timestamps: false,
    indexes:[
        {
            name: "PRIMARY",
            unique:true,
            using:"BTREE",
            fields:[
                {name:"idUsuario"}
            ]
        }
    ]
})

}