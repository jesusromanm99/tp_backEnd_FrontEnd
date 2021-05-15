const ENDPOINT="http://localhost:9090/"

//obtiene todas las mesas para un restaurant
const get_todas_mesas= async(id_restaurant)=> {
    mesas= await fetch(ENDPOINT+"api/mesa/restaurantes/"+id_restaurant)
    if( mesas){
        return mesas.json()
    }
    
}
//obtiene todos los restaurantes
const get_todos_restaurantes = async()=>{
    const res = await fetch(`${ENDPOINT}api/restaurant/`);
    if(res){
        const data = res.json();
        return data;
    }
}

//funcion que obtine cuantos pisos existe para un determinado restaurant
const get_todos_pisos= (mesas)=>{
    nr_piso=null,
    pisos=[]
    mesas.forEach(element => {
        if(nr_piso!=element.planta){
            nr_piso=element.planta;
            pisos.push(nr_piso)
        }
    });
    return pisos
}

//funcion que obtiene todas las mesas para una determinada planta
const get_mesas_planta=(mesas,planta)=>{
    mesas_planta=[]
    mesas.forEach(element => {
        if(planta==element.planta){
            nr_piso=element.planta;
            mesas_planta.push(element)
        }
    });
    return mesas_planta
}

const app= new Vue({
    el:"#app",
    data:{
        mesas:[],
        id_Restaurante:null,
        image_src:"mesa2d-2.jpg",
        vueCanvas:null,
        restaurantes:[],
        pisos:[],
        mesa_piso:null,
        mesas_plantas:[],
        medidas:{
            canvas_h:2000, //altura del canvas
            canvas_w:1350, // anchura del canvas
            i_h:300, //altura de la imagen
            i_w:300, // anchura de la imagen
            espaciado:50,
        },
        banGraficar:false,
        showCanvas:false,
        messageError:null
    },
    methods:{
        graficarMesas: function () {
            
            if(this.mesas_plantas!=[]){
                this.banGraficar=true;
                console.log("mesas planta",this.mesas_plantas)
                var i=0;
                var p=-this.medidas.espaciado;
                var y_anterior=null
                this.mesas_plantas.forEach(mesa => {
                    if(mesa.posicion_y!==y_anterior){ 
                        y_anterior=mesa.posicion_y;
                        //console.log("SI ES DISTINTO",y_anterior)
                        i=0;
                        p+=this.medidas.espaciado;
                        //console.log(mesa.posicion_x,mesa.posicion_y)
                    }
                    x=mesa.posicion_x*this.medidas.i_w-this.medidas.i_w+ mesa.posicion_x*this.medidas.espaciado
                    y=mesa.posicion_y*this.medidas.i_h-this.medidas.i_h+ mesa.posicion_y*this.medidas.espaciado
                    this.drawImage(x,y)
                    this.addText("hola",x,y)
                    i+=this.medidas.espaciado;
                });
            }else{
                this.banGraficar=true;
            }
            //console.log(mesas)     
        } ,
        drawImage : function (x,y)  {
            const image = new Image();
            image.src = this.image_src;
            image.onload = () => {
               this.vueCanvas.drawImage(image,x,y,this.medidas.i_w,this.medidas.i_h)
            }
        },
        addText: function(texto,x,y){
            this.vueCanvas.font = "10px Arial";
           // console.log(texto)
            this.vueCanvas.fillText(texto,x,y+10)
        },
        loadRestaurant: async function() {
            this.restaurantes = await get_todos_restaurantes();
            //console.log("aca entreee",this.restaurantes)

        },
        graficar_mesas: function(){
            if(this.id_Restaurante==null  || this.mesa_piso==null ){
                this.messageError="Restaurante o Piso no fueron seleccionados"
            }
            else{
                this.messageError=null;
                this.showCanvas=true;
                this.mesas_plantas=get_mesas_planta(this.mesas,this.mesa_piso)
                var c = document.getElementById("myCanvas");
                this.vueCanvas = c.getContext("2d");
                this.vueCanvas.clearRect(0, 0, this.medidas.canvas_w, this.medidas.canvas_h);
                this.graficarMesas()
            }

        },
        onSelectRestaurant: async function(){
           // console.log("siuuu")
            this.mesas= await get_todas_mesas(this.id_Restaurante) //aca obtengo todas las mesas para el restaurant seleecionado
            console.log("las mesas de este restaurant son:",this.mesas)
            this.pisos=get_todos_pisos(this.mesas)
            
        }
    },
    mounted:function(){
        this.loadRestaurant()
        
        
        //this.graficarMesas() //method1 will execute at pageload
        
    }
})

