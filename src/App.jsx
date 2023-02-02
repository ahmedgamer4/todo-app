import { useState, useEffect } from 'react'
import './App.css'
import React from 'react'
import PropTypes from 'prop-types'

const Task = ({ task, tasks, setTasks }) => {

  const modifyTask = (newTask) => {
    const id = task.id

    setTasks(tasks.map((t) => t.id === id ? newTask : t))
  }

  const removeTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id))
  }

  return (
    <li className='flex gap-3 items-center justify-between px-1'>
      <div className='flex items-center gap-3'>
        <input id="default-checkbox" type="checkbox" value='' checked={task.completed}
        className={`w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded
         focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800
         focus:ring-2 dark:bg-gray-700 dark:border-gray-600 ${task.completed === true ? 'line-through' : ''}`}
         onClick={() => modifyTask({...task, completed: !task.completed})} onChange={() => 0} />
        <p className='text-gray-700 text-xl'>{ task.input }</p>
      </div>
      <i className="fa-solid fa-trash w-4 h-4 text-red-600 cursor-pointer" onClick={() => removeTask(task.id)}></i>
    </li>
  )
}

Task.propTypes = {
  task: PropTypes.object,
  tasks: PropTypes.array,
  setTasks: PropTypes.func,
}

const App = () => {
  const [taskInput, setTaskInput] = useState('')
  const [tasks, setTasks] = useState([])
  const [activeTasks, setActiveTasks] = useState([])
  const [completedTasks, setCompletedTasks] = useState([]) 
  const [currentDiv, setCurrentDiv] = useState('all')

  const allStyle = {display: currentDiv === 'all' ? '' : 'none'}
  const activeStyle = {display: currentDiv === 'active' ? '' : 'none'}
  const completedStyle = {display: currentDiv === 'completed' ? '' : 'none'}

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('tasks'))
    if (items) {
      setTasks(items)
    }
  }, [])

  useEffect(() => {
    setActiveTasks(tasks.filter((t) => t.completed === false))
    setCompletedTasks(tasks.filter((t) => t.completed === true))
  }, [currentDiv, tasks])

  const getId = () => Math.floor(Math.random() * 1000000)

  const removeCompleted = () => {
    setTasks(tasks.filter((t) => !t.completed))
  }
  
  const addTask = (e) => {
    e.preventDefault()
    const newTask = {
      input: taskInput,
      completed: false,
      id: getId(),
    }

    if (newTask.input) {
      setTasks((tasks) => tasks.concat(newTask))
      setTaskInput('')
      console.log(tasks)
    }

    localStorage.clear()
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }

  return (
    <div className='max-w-[500px] flex flex-col gap-4 mx-auto'>
      <h1 className='text-4xl text-gray-700 font-bold mx-auto'>#TODO</h1>
      
      <div className='border-b border-b-gray-400 flex justify-around pl-14 py-2 text-base text-gray-700 font-semibold'>
        <button className={`relative after:h-[5px] pb-2 after:bg-[#2F80ED] after:w-full after:absolute after:bottom-0 after:left-0 after:rounded-t-[4px] ${
                            currentDiv === 'all' ? 'after:inline' : 'after:hidden'}`} onClick={() => setCurrentDiv('all')}>All</button>

        <button className={`relative after:h-[5px] pb-2 after:bg-[#2F80ED] after:w-full after:absolute after:bottom-0 after:left-0 after:rounded-t-[4px] ${
                            currentDiv === 'active' ? 'after:inline' : 'after:hidden'}`} onClick={() => setCurrentDiv('active')}>Active</button>

        <button className={`relative after:h-[5px] pb-2 after:bg-[#2F80ED] after:w-full after:absolute after:bottom-0 after:left-0 after:rounded-t-[4px] ${
                            currentDiv === 'completed' ? 'after:inline' : 'after:hidden'}`} onClick={() => setCurrentDiv('completed')}>Completed</button>
      </div>

      <form onSubmit={addTask} className={`flex flex-col sm:flex-row gap-3 ${currentDiv === 'all' ? '' : 'hidden'}`}>
        <input type="text" className='flex-grow rounded-lg h-11 shadow-md px-4 outline-blue-300 text-sm text-gray-800'
         placeholder='add a task' value={taskInput} onChange={(e) => setTaskInput(e.target.value)} />
        <button className='bg-blue-500 rounded-lg px-6 py-2 text-white font-bold' type='submit'>Add</button>
      </form>

      <ul className='flex flex-col gap-4' style={allStyle}>
        { tasks.map((t) => <Task task={t} tasks={tasks} setTasks={setTasks} key={tasks.indexOf(t) + 1}/>) }  
      </ul> 

      <ul className='flex flex-col gap-4' style={activeStyle}>
        { activeTasks.map((t) => <Task task={t} tasks={tasks} setTasks={setTasks} key={tasks.indexOf(t) + 1}/>) }  
        { activeTasks.length <= 0 ? <h2 className='mx-auto my-6 font-semibold'>No active tasks!</h2> : ''}
      </ul> 

      <ul className='flex flex-col gap-4' style={completedStyle}>
        { completedTasks.map((t) => <Task task={t} tasks={tasks} setTasks={setTasks} key={tasks.indexOf(t) + 1}/>) }  
        { completedTasks.length <= 0 ? <h2 className='mx-auto my-6 font-semibold'>No completed tasks!</h2> 
        : <button className='text-white bg-red-600 rounded-lg px-4 py-2' onClick={removeCompleted}>Delete All</button>}
      </ul> 

    </div>
  )

}

export default App
