// var list = [{
//     title: "吃饭",
//     checked: true
// },{
//     title: "睡觉",
//     checked: false
// }]


//处理 localstorage
var setLocal = {
    save(key, value){
        localStorage.setItem(key,JSON.stringify(value))
    },
    get(key){
        return JSON.parse(localStorage.getItem(key))
    }
}
var filterChecked = {
    all(list){
        return list
    },
    finish(list){
        return list.filter(function(item){
            return item.checked
        })
    },
    unfinish(list){
        return list.filter(function(item){
            return !item.checked
        })
    }
}

var list = setLocal.get("todo") ||[];
var vm = new Vue({
    el:".main",
    data:{
        list: list,
        inputValue: "",
        editingtodo : "",
        beforeEditing : "", 
        visibility: "all"  
        
    },
    watch:{ //监听函数  list发生改变时调用这个函数
        list: {
            deep: true,//深层次的监听     deep = true  前面check勾选也能触发  
            handler: function(){   // handler  是处理函数
                setLocal.save("todo",this.list)                   
            }
        }
    },
    computed:{
        filterList(){ //计算属性   list发生变化  filter就发生变化
            return this.list.filter(function(item){return !item.checked}).length 
        },
        filterCheck(){
            return filterChecked[this.visibility]?filterChecked[this.visibility](this.list):this.list
        }
    },
    methods:{
        addTodo(){
            if(this.inputValue==""){
                return
            }
            this.list.push({
                title: this.inputValue,
                checked: false
            })
            this.inputValue = ""; 
        },
        deleteTodo(todo){
            var index = this.list.indexOf(todo);
            this.list.splice(index,1)//splice 是vue重新写的  
        },
        editTodo(todo){
            this.editingtodo = todo;
            this.beforeEditing = todo.title;
        },
        editedTodo(){
            this.editingtodo = ""
        },
        cancelEdit(todo){
            todo.title = this.beforeEditing;
            this.beforeEditing = "",
            this.editingtodo = ""
        }
    },
    directives:{  
        focus:{   //钩子函数   什么时候触发这个函数
             update(el,binding){ //双击时改变
                 if(binding.value){
                    el.focus()  
                 }else{
                 }
             }
        }
    }
})
function hashchange(){
    var hash = window.location.hash.slice(1);
    vm.visibility = hash;
    console.log(vm.visibility)
}
hashchange()
//通过给widow添加hashchange  来监听a标签hash的改变
window.addEventListener("hashchange",hashchange)