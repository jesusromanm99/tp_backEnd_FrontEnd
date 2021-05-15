const ENDPOINT="http://localhost:9090/"


const get_todos_restaurantes = async()=>{
    const res = await fetch(`${ENDPOINT}api/restaurant/`);
    if(res){
        const data = res.json();
        return data;
    }
}

const get_mesas_disponibles=(mesas,mesas_ocupadas)=>{
    mesas_disponibles=[]
    //console.log(mesas)
    //console.log(mesas_ocupadas)
    mesas.forEach(element => {
        var mesa= mesas_ocupadas.find( valor =>{
            //console.log("1-",valor.id_mesa)
            //console.log("2-",element.id)
            return valor.id_mesa==element.id
        })
        //console.log(mesa)
        if(!mesa){
            mesas_disponibles.push(element)
        }
    });
    //console.log("Estas son todas las mesas disponibles",mesas_disponibles)
    return mesas_disponibles;
}
const get_mesas_ocupadas= async (id_res,fecha,hora_inicio,hora_fin)=>{
    date=fecha
    params=id_res+"/"+date+"/"+hora_inicio+"/"+hora_fin
    res= await fetch(ENDPOINT+"api/reserva/mesas/"+params)
    if(res) return res.json()
}
const get_todas_mesas= async(id_restaurant)=> {
    mesas= await fetch(ENDPOINT+"api/mesa/restaurantes/"+id_restaurant)
    if( mesas){
        return mesas.json()
    }
    
}
const get_date_correct_form= (date)=>{
    newDate=date.split("-")
    return newDate[0]+"-"+newDate[2]+"-"+newDate[1];
}
const get_date_correct_form_post= (date)=>{
    newDate=date.split("-")
    return newDate[1]+"-"+newDate[2]+"-"+newDate[0];
}


const app= new Vue({
    el:"#app",
    data:{
        reserva:{
                    fecha:"",
                    hora_inicial:"",
                    hora_final:"",
                    id_restaurante:"",
                    id_mesa:"",
                    id_cliente:"",
                    cantidad_solicitada:"",
        },
        restaurantes:[],
        rango_horas_inicio:[12,13,14,15,19,20,21,22],
        rango_horas_fin:[13,14,15,20,21,22,23],
        hora_inicio:null,
        hora_fin:null,
        mesasDispobibles:[],
        restaurant_index:1,
        hora_index:1,
        fecha:null,
        mesaObject:null,
        cedula:null,
        cliente:{
            nombre:null,
            apellido:null,
            cedula:null
        },
        findCedula:true ,
        reservaLista:false ,
        mensaje_error:null,
        mensaje_exito:null,
    },
    mounted:function(){
        this.beforeCreate() //method1 will execute at pageload
    },
    methods:{
        beforeCreate: async function() {
            this.restaurantes = await get_todos_restaurantes();
            console.log("aca entreee",this.restaurantes)

        },
        buscar_reservas:async function(){
            if(this.hora_inicio<=15 && this.hora_fin>15){
                this.mensaje_error="El rango de hora seleccionada es el incorrecta"
            }
            else if(this.fecha==null){
                this.mensaje_error="Seleccione una fecha"
            }
            else if(this.hora_inicio>=this.hora_fin){
                this.mensaje_error="Seleccione una fraja de horario correcta"
            }else{
                this.mensaje_error=null
                mesas_ocupadas= await get_mesas_ocupadas(this.restaurant_index,this.fecha,this.hora_inicio,this.hora_fin)
                console.log(mesas_ocupadas)
                mesas= await get_todas_mesas(this.restaurant_index)  
                console.log("todas las mesas",mesas)    
                this.mesasDispobibles=get_mesas_disponibles(mesas,mesas_ocupadas);
                console.log("mesasDisponibles",this.mesasDispobibles)
            }
            
         },
        guardar_reserva: function(){
                //crear el cliente
                this.settearReserva()
                console.log("reserva:",JSON.stringify(this.reserva))
                fetch(ENDPOINT+"api/reserva/", {
                method: 'POST',
                body:JSON.stringify(this.reserva),
                headers:{
                    'Content-Type': 'application/json'
                  }
                 }).then(response =>{
                   if(response.ok){return response.json}
                  else { throw "Erro al hacer el post de reserva"}
                 })
                .then(data=>{
                     console.log("Se creo la Reserva",data);
                     //this.findCedula = false;
                     //this.reservaLista = false;
                     this.mensaje_exito = "Se creo la Reserva";
                    })
                .catch(err=>console.log(err))
                //crea y confirma una reserva
         },
        buscar_cedula: async function(){
            if(this.cliente.cedula!=null){
                this.mensaje_error=null 
                cliente= await fetch(ENDPOINT+"api/cliente/cedula/"+this.cliente.cedula)
                .then(data=> {
                    if(data.status!=400) {
                        return data.json()
                    }
                    else return null
                })
                if(cliente){
                    this.cliente=cliente;
                    this.settearReserva()
                    
                }else{
                    this.findCedula=false
                    this.reservaLista=false
                    console.log("no existe el cliente   ")
                    return false
                }
            }else{
                this.mensaje_error="Ingrese su numero de cedula"
            }
            
         },
        confirmar_datos: function(){
        //crear el cliente por debajo
        if(this.cliente.nombre==null || this.cliente.apellido==null){
            this.mensaje_error="Complete bien los campos"
        }
        else if(this.mesaObject==null){
            this.mensaje_error="Seleccione una de las mesas disponibles para realizar la reserva"
        }
        else{
            // console.log("a2",JSON.stringify(this.cliente))
            this.mensaje_error=null
            fetch(ENDPOINT+"api/cliente/", {
                method: 'POST',
                body:JSON.stringify(this.cliente),
                headers:{
                    'Content-Type': 'application/json'
                }
            }).then(response =>{
                if(response.ok){return response.json()}
                else { throw "Erro al hacer el post de cliente"}
            })
            .then(data=> {
                this.cliente=data; 
                console.log("Se creo el cliente",data)
                })
            .catch(err=>console.log(err))
            console.log("a")
            this.reservaLista=true
            this.settearReserva()
        }
        
        },
        guardar_restaurant: async function(){
            
        },
        settearReserva:function(){
        if(this.mesaObject==null){
            this.mensaje_error="Seleccione una de las mesas disponibles para realizar la reserva"
        }else{
            this.mensaje_error=null
            newReserva={
                fecha:get_date_correct_form_post(this.fecha),
                hora_inicial:this.hora_inicio,
                hora_final:this.hora_fin,
                id_restaurante:this.restaurant_index,
                id_mesa:this.mesaObject.id,
                id_cliente:this.cliente.id,
                cantidad_solicitada:this.mesaObject.capacidad
            };
            this.reserva=newReserva
            this.reservaLista=true
        }
        
        }
    }
})