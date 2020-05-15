//src/configStore.ts
const rootReducer = combineReducers({
	todos: todosReducer, //import from '/todos/todosSlice'
	visibilityFilter: visibilityFilterReducer// import from '/filters/filtersSlice'
  })
const store = configureStore({ //создание стора
	reducer: rootReducer,
	middleware: [somethingMiddleware, ...getDefaultMiddleware()],
  })



//src/features/todos/todosSlice.js
  let nextTodoId = 0
  const todosSlice = createSlice({
	name: 'todos', //name используется для формирования типа в экшене, для 
	initialState: [], //экшена addTodo поле type будет 'todos/addTodo' и т.д.
	reducers: {
	  addTodo: {//это имя action creator'а и так-же тут создается функция, которая 
		reducer(state, action) {//в reducer'е выполнится когда будет отправлен этот action
		  const { id, text } = action.payload
		  state.push({ id, text, completed: false })//state можно мутировать благодаря immer'у
		},
		prepare(text) { //это для работы с данными, передаваемыми в action creator
		  return { payload: { text, id: nextTodoId++ } }
		}
	  },
	  toggleTodo(state, action) { //а тут просто сокращенный вариант. В отличие от предыдущего
		const todo = state.find(todo => todo.id === action.payload)//тут нету работы с данными action areator'а и 
		if (todo) {//когда будет запущен action areator toggleTodo, то что будет у него в параметрах toggleTodo(тут), попадет в payload экшена
		  todo.completed = !todo.completed
		}
	  }
	}
  })
  
  export const { addTodo, toggleTodo } = todosSlice.actions// экспорт action creator'ов
  
  export default todosSlice.reducer //экспорт редьюсера

//Вот так будет выглядеть объект, который вернет функция createSlice:
{
	name: "todos",
	reducer: (state, action) => newState,
	actions: {
	  addTodo: (payload) => ({type: "todos/addTodo", payload}),
	  toggleTodo: (payload) => ({type: "todos/toggleTodo", payload})
	},
	caseReducers: {
	  addTodo: (state, action) => newState,
	  toggleTodo: (state, action) => newState,
	}
  }



////////////////////////////////////////
//Вариант без использования createSlice:

const addTodo = createAction('ADD_TODO')//создания action creator'а
addTodo({ text: 'Buy milk' })
// {type : "ADD_TODO", payload : {text : "Buy milk"}})

console.log(addTodo.toString())
// "ADD_TODO"

console.log(addTodo.type);
// "ADD_TODO"

const reducer = createReducer({/* тут initial state */}, {//создание редьюсера
    // actionCreator.toString() will automatically be called here
    [addTodo] : (state, action) => {}  //вызовится эта функция, если сработает action creator addTodo

    // Or, you can reference the .type field:
    [addTodo.type] : (state, action) => { } 
});

//подводные камини с  immer:
// 1) нельзя в reducer'е мутировать state а потом еще и делать return 