# Value Iteration

## What is Value Iteration?

Value iteration is a method of computing an optimal policy for a Markov Decision Process(MDP) and its value. Value Iteration is a dynamic programming method to find solutions for MDPs. Value Iteration works by iteratively refining the estimate of the Utility/Value function of the state, leading to convergence. The utility/value of a state is the sum of its immediate reward and the utility of the successor state multiplied by the discount factor, under the assumption that the policy is optimal. Let's say we are at a stage s. As the utility value of a state is associated with the optimal policy, it means the state value function of state s is the best value we could get after we reach the state s. In other words, the state value function of the state is the best result among all the possible paths to that state. So when at state s, among all the actions at the state s, the action should be chosen in such a way that it provides the highest utility to the state.

## Bellman Equation

The Bellman Equation, which captures the following direct relationship between the utility of a state to the utility of its neighbors, which also forms the basis of Value Iteration, is given by:

{ Put the equation here }

Where U(s) is the utility of a state,  R(s, a) is the immediate reward, U(s') is the expected utility of the following state s' and P(s' |s, a) is the transition function. Gamma is the discount factor.

Essentially, the value iteration algorithm operates by enhancing the estimate of the state value function. Solving for state value function/utility values is just solving the bellman equations. In value iteration, random values are initially assigned to state values V(s) and updated iteratively using the above bellman equation until convergence. Convergence is said to be reached when changes in the utility value of all the states are negligible(less than a small constant).

### Discount factor : Gamma

The discount factor generally determines how significant (relative weightage) the distant rewards are compared to immediate rewards. With various values of discount factors, the optimal policies could vary slightly. The considerable effect of the discount factor is on the number of iterations that the value iteration takes to converge. The larger the value of the discount factor, the more the number of iterations it takes to converge.

## Pseudo Code

{ Put the pseudo-code here }
