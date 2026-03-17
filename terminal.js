// show menu of commands
// user input

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const fs = require('fs');
const { time } = require('console');

let menu = `
Welcome to the task manager!
Available commands:
1. add <task_description> - Add a new task
2. delete <task_id> - Delete a task by its ID
3. update <task_id> <new_description> - Update a task's description by its ID
4. pending <task_id> - Mark a task as pending by its ID
5. in_progress <task_id> - Mark a task as in progress by its ID
6. complete <task_id> - Mark a task as completed by its ID
7. show <task_id> - Show a task by its ID
8. list <status> - List all tasks, optionally filtered by status (pending, in_progress, completed)  
9. exit
`


let storage = {};
let greatest_id = 0;
fs.readFile("data.json", (err, raw_data) => {
    if (err) return;
    data = JSON.parse(raw_data);
    storage = data["storage"]
    greatest_id = data["greatest_id"]
})

let update_data_file = (storage, greatest_id) => {
    data = {
        storage,
        greatest_id
    }
    fs.writeFile("data.json", JSON.stringify(data), err => {
        if (err) throw err;
    })
}

rl.setPrompt(menu);
rl.prompt();

rl.on('line', (input) => {
    const [command, ...args] = input.trim().split(' ');
    switch (command) {
        case 'add':
            // Add task logic
            id = greatest_id + 1;
            current_time = Date.now()
            storage[id] = {
                description: args.join(' '),
                status: 'pending',
                created_at: current_time,
                updated_at: current_time
            };
            console.log(storage[id])
            greatest_id = id;
            update_data_file(storage, greatest_id);
            console.log(`Adding task: ${args.join(' ')}`);
            break;
        case 'delete':
            // Delete task logic
            id = args[0];
            if (storage[id]) {
                delete storage[id];
                update_data_file(storage, greatest_id);
                console.log(`Deleted task with ID: ${id}`);
            } else {
                console.log(`Task with ID: ${id} not found`);
            }
            console.log(`Deleting task with ID: ${args[0]}`);
            break;
        case 'update':
            // Update task logic
            id = args[0];
            if (storage[id]) {
                storage[id].description = args.slice(1).join(' ');
                storage[id].updated_at = Date.now()
                update_data_file(storage, greatest_id);
                console.log(`Updated task with ID: ${id} to new description: ${storage[id].description}`);
            } else {
                console.log(`Task with ID: ${id} not found`);
            }
            console.log(`Updating task with ID: ${args[0]} to new description: ${args.slice(1).join(' ')}`);
            break;
        case 'pending':
            // Mark task as pending logic
            id = args[0];
            if (storage[id]) {
                storage[id].status = 'pending';
                update_data_file(storage, greatest_id);
                console.log(`Marked task with ID: ${id} as pending`);
            } else {
                console.log(`Task with ID: ${id} not found`);
            }
            break;
        case 'in_progress':
            // Mark task as in progress logic
            id = args[0];
            if (storage[id]) {
                storage[id].status = 'in_progress';
                update_data_file(storage, greatest_id);
                console.log(`Marked task with ID: ${id} as in progress`);
            } else {
                console.log(`Task with ID: ${id} not found`);
            }
            break;
        case 'complete':
            // Mark task as completed logic
            id = args[0];
            if (storage[id]) {
                storage[id].status = 'completed';
                update_data_file(storage, greatest_id);
                console.log(`Marked task with ID: ${id} as completed`);
            } else {
                console.log(`Task with ID: ${id} not found`);
            }
            break;
        case 'show':
            // Show task status logic
            id = args[0];
            if (storage[id]) {
                console.log(`Task with ID: ${id} is: ${storage[id].description} - ${storage[id].status}`);
            } else {
                console.log(`Task with ID: ${id} not found`);
            }
            break;
        case 'list':
            // List tasks logic
            const status_filter = args[0];
            console.log(`Listing tasks with status: ${status_filter || 'all'}`);
            for (const [id, task] of Object.entries(storage)) {
                if (!status_filter || task.status === status_filter) {
                    console.log(`Task with ID: ${id} is: ${task.description} - ${task.status}`);
                }
            }
            break;
        case 'exit':
            rl.close();
            break;
        default:
            console.log('Unknown command. Please try again.');
    }
    rl.prompt();
}).on('close', () => {
    console.log('Exiting task manager. Goodbye!');
    process.exit(0);
});