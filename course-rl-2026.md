---
layout: default
title: "Advanced Probabilistic Methods Related to Reinforcement Learning"
nav: "teaching"
body_class: "course"
sims: true
---
# Advanced Probabilistic Methods Related to Reinforcement Learning

TU Berlin, Winter 2026/27. Lecturer: Tejas Iyer. 5 ECTS, taught in English.
{: .lede}

## Organisation

Lectures every Tuesday 16:15–17:45; please consult Moses and ISIS for the precise schedule and any changes. Questions after lectures, or by email: first.lastname@wias-berlin.de. The oral exam is organised in consultation with me.

## Description

Reinforcement learning concerns decision-making under uncertainty when information is acquired through interaction with an environment. An agent repeatedly chooses actions, observes their consequences, and uses these observations to improve future decisions. A central difficulty is that actions can serve two purposes at once: obtaining reward now and gathering information that may improve later decisions. This tension is known as the exploration–exploitation trade-off.

This course develops a rigorous, proof-based and probabilistic perspective on sequential learning and reinforcement learning. We will begin with stochastic multi-armed bandits, the simplest setting in which the exploration–exploitation trade-off can be isolated and studied mathematically. Bandits provide a particularly transparent framework in which to introduce adaptive learning strategies, regret, concentration inequalities, information-theoretic arguments, and the question of optimal performance.

A recurring theme will be the comparison of different principles for learning: committing after an initial exploration phase, forced or randomized exploration, optimism under uncertainty, Bayesian or posterior-sampling methods, and direct optimization of policies. We will study how such methods use information, how their performance can be quantified, and when their regret or error rates are optimal or near-optimal.

We will then place these ideas in the broader setting of Markov decision processes, where present actions affect not only immediate rewards but also future states and therefore future opportunities. Depending on the progress and interests of the class, topics may include dynamic programming, Monte Carlo methods, stochastic approximation, temporal-difference learning, Q-learning, policy-gradient methods, and related probabilistic techniques.

Throughout the course, the emphasis will be on mathematical modelling, probabilistic reasoning, algorithmic ideas, and rigorous proofs rather than programming or implementation. No previous background in machine learning or reinforcement learning is required.

## Syllabus

The precise selection, depth, and order of topics will be adjusted according to the background, progress, and interests of the class.

**Probabilistic methods**

- Concentration inequalities and sub-Gaussian estimates
- Conditioning, martingales, stopping times, and adaptively collected data
- Likelihood ratios, relative entropy, change of measure, and stochastic approximation

**Stochastic bandits and sequential learning**

- Exploration–exploitation, adaptive strategies, cumulative reward, and regret
- Explore-then-commit, greedy and randomized exploration, UCB methods, Thompson sampling
- Instance-dependent and minimax regret, lower bounds, KL methods, and optimality

**Markov decision processes and value-based learning**

- Finite MDPs, policies, value functions, and Bellman equations
- Value iteration and policy iteration
- Monte Carlo methods, temporal-difference learning, SARSA, and Q-learning

**Further topics, as time permits**

- Contextual or adversarial bandits
- Softmax policies and policy-gradient methods
- REINFORCE, actor–critic methods, and related extensions

## Prerequisites

- Probability I
- Probability II is highly encouraged and may be taken concurrently with this course
- Familiarity with conditional expectations and martingales will be useful; any additional probabilistic tools needed in the course will be introduced or reviewed as required
- No previous knowledge of machine learning or reinforcement learning is assumed
- Please contact me by email if you have any doubts about the prerequisites

## Learning outcomes

The course is intended both as preparation for further study or research in probability, statistics, machine learning and reinforcement learning, and as training in rigorous mathematical reasoning about adaptive algorithms and data.

Students will develop skills in advanced probabilistic reasoning, algorithmic analysis, mathematical modelling, and clear communication of technical arguments. These skills are relevant not only in reinforcement learning, but also in statistics, sequential experimentation, technology, finance, operations research, and other areas involving decision making under uncertainty.

On satisfying the requirements of the course, students should be well-equipped to:

- Formulate sequential learning and reinforcement-learning problems mathematically
- Explain the exploration–exploitation trade-off and distinguish different approaches to balancing learning and reward
- Apply concentration inequalities, conditioning, martingales, and information-theoretic tools to sequential decision problems
- Formulate finite Markov decision processes and work with value functions and Bellman equations
- Explain the mathematical ideas behind selected value-based or policy-based reinforcement-learning methods
- Read, reconstruct, and communicate rigorous proofs in sequential learning and reinforcement learning

## Assessment

The assessment for this course consists of a 45-minute oral exam. The exam will assess your ability to:

1. Explain the principal models, algorithms, probabilistic ideas, and results developed in the course, including proofs where appropriate.
2. Respond to follow-up questions and apply the methods from the course to examples or small variations of material encountered in the lectures and exercises.

The emphasis will be on mathematical understanding and reasoning rather than memorisation. Only topics actually covered during the course will be examinable. More detailed guidance will be provided during the semester.

## Try it: exploration versus exploitation

A two-armed bandit is a slot machine with two levers, each paying out with an unknown probability. Every pull you spend learning about the worse lever costs you, and the cumulative cost is called *regret*. A greedy player that always pulls the lever that looks best so far can be fooled by early bad luck and stay fooled, so its regret grows linearly in time. The Lai–Robbins theorem shows that no sensible algorithm can do better than regret growing like a constant times log t, and identifies the constant. Below, compare algorithms that reach this rate with ones that don't.

{% include sim-bandits.html %}

Two arms succeed with probabilities ½ + Δ/2 and ½ − Δ/2; the better arm is chosen at random on each run. Curves show the regret averaged over 100 independent runs of 5,000 rounds, on a logarithmic time axis, where regret of order log t appears as a straight line. The dashed line is the Lai–Robbins rate (Δ / KL) log t. It is an asymptotic lower bound on the slope, so good algorithms can sit below it for a while; what matters is that, eventually, no algorithm's curve can be flatter. Click an algorithm's name to hide or show it.
{: .caption}

## Resources

Links to lecture notes and additional resources will be provided as the course progresses. The course will draw substantially on:

- L. Döring et al., *The Mathematics of Reinforcement Learning*.
