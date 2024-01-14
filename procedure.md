### **Step 1: Modify Cell States**
- In the practice section, **double click/single click** on cells to change them.
  - **Terminal States:** Goal states like the charging station.
  - **Blocked States:** Inaccessible areas or obstacles.

### **Step 2: Adjust Parameters and Grid Size**
- Use the **Control Menu** to modify algorithm parameters and grid size.

### **Step 3: State Value Function Representation**
- The grid displays the **State Value Function** for each state, showing potential rewards for directions: Left, Up, Right, and Down.

### **Step 4: Progressing Through Iterations**
- Click **"Next Value"** to calculate the state function for the next state in the current iteration.
  - When a terminal state is reached or the maximum number of steps per iteration is exceeded, the iteration count increases and steps reset to 0.

### **Step 5: Moving to Next Iteration**
- Select **"Next Iteration"** to advance to the following cycle of the algorithm.

### **Step 6: Policy Representation**
- The **arrows in the left grid** indicate the policy currently being learned.

### **Step 7: Convergence to Optimal Policy**
- A message will be displayed when the State Value Functions of all states converge, indicating the selection of an **Optimal Policy**.
