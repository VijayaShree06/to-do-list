document.addEventListener('DOMContentLoaded',() => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const emptyImage = document.querySelector('.List-is-empty');
    const listcontainer = document.querySelector('.list-container');
    const progressbar =document.getElementById('progress');
    const progessnumber = document.getElementById('numbers');
    const toggleEmptyState = ()=>{
        emptyImage.style.display=taskList.children.length === 0 ? 'block': 'none';
        listcontainer.style.width = taskList.children.length>0 ? '100%' :'50%';
    };
    const updateProgess = (checkCompletion = true)=>{
        const totalTasks =taskList.children.length;
        const completedTasks = taskList.querySelectorAll('.checkbox:checked').length;

        progressbar.style.width = totalTasks ? `${(completedTasks / totalTasks) * 100}%` : '0%';
        progessnumber.textContent = `${completedTasks}/${totalTasks}`;

        if(checkCompletion && totalTasks > 0 && completedTasks === totalTasks) {
            Confetti();
        }
    };

    const saveTaskToLocalStorage = () => {
        const tasks = Array.from(taskList.querySelectorAll('li')).map(li=>({ text: li.querySelector('span').textContent,
            completed: li.querySelector('.checkbox').checked
        }));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };
    const loadTasksFromLocalStorage = () => {
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        savedTasks.forEach(({text, completed}) => addTask(text, completed, false));
        toggleEmptyState();
        updateProgess();
    };

    const addTask =(text,completed = false,checkCompletion = true) => {
        const taskText = text || taskInput.value.trim();
        if(!taskText) {
            return;
        }
        const li = document.createElement('li');
        li.innerHTML = `
        <input type="checkbox" class="checkbox" ${ completed ? 'checked' : ''} />
        <span>${taskText}</span>
        <div class="task-buttons">
        <button class="edit-btn"><i class="fa-solid fa-pen"></i></button><button class="delete-btn"><i class="fa-solid fa-trash"></i></button></div>
        `;

        const checkbox = li.querySelector('.checkbox');
        const editbtn = li.querySelector('.edit-btn');
        
        if (completed){
            li.classList.add('completed');
            editbtn.disabled = true;
            editbtn.style.opacity ='0.5';
            editbtn.style.pointerEvents ='none';
        }

        checkbox.addEventListener('change',() => {
            const isChecked = checkbox.checked;
            li.classList.toggle('completed',isChecked);
            editbtn.disabled=isChecked;
            editbtn.style.opacity=isChecked ? '0.5':'0.1';
            editbtn.style.pointerEvents= isChecked ? 'none':'auto';
            updateProgess();
            saveTaskToLocalStorage();

        });

        editbtn.addEventListener('click', () => {
            if(!checkbox.checked) {
                taskInput.value = li.querySelector('span').textContent;
                li.remove();
                toggleEmptyState();
                updateProgess(false);
                saveTaskToLocalStorage();

            }
        });
        li.querySelector('.delete-btn').
        addEventListener('click',() => { 
            li.remove();
            toggleEmptyState();
            updateProgess();
            saveTaskToLocalStorage();
        });
        taskList.appendChild(li);
        taskInput.value='';
        toggleEmptyState();
        updateProgess(checkCompletion);
         saveTaskToLocalStorage();
    };

    addTaskBtn.addEventListener('click', () => addTask());
    taskInput.addEventListener('keypress',(e)=>{
        if(e.key=== 'Enter'){
            e.preventDefault();
            addTask();
        }
    });
     loadTasksFromLocalStorage();
});
const Confetti = ()=> {
    const count = 200,
  defaults = {
    origin: { y: 0.7 },
  };

function fire(particleRatio, opts) {
  confetti(
    Object.assign({}, defaults, opts, {
      particleCount: Math.floor(count * particleRatio),
    })
  );
}

fire(0.25, {
  spread: 26,
  startVelocity: 55,
});

fire(0.2, {
  spread: 60,
});

fire(0.35, {
  spread: 100,
  decay: 0.91,
  scalar: 0.8,
});

fire(0.1, {
  spread: 120,
  startVelocity: 25,
  decay: 0.92,
  scalar: 1.2,
});

fire(0.1, {
  spread: 120,
  startVelocity: 45,
});
};