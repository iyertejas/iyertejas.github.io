---
layout: default
title: "Research"
nav: "research"
sims: true
body_class: "research"
description: "Research of Tejas Iyer: phase transitions in reinforced growth processes, random trees, coagulation and branching processes, with interactive simulations."
---
# Research

{% include sim-phases.html caption="Such phase transitions arise in diverse contexts, including learning algorithms, models from statistical physics and random networks." %}

My research is in probability theory and its applications. Key focal points of my work include stochastic processes with reinforcement and feedback, and random discrete structures: models motivated by applications as diverse as learning algorithms, biological populations, statistical physics and complex networks. Like water freezing or boiling, such systems often have *phase transitions*: a small change in a parameter produces dramatically different behaviour. A central goal of my research is to understand these transitions with mathematical precision.
{: .lede}

Each question below comes with simulations you can run in your browser, built with the help of Santa Claude.
{: .lede}

## When does an early lead become permanent?

Reinforced processes are models in which past success makes future success more likely. They appear as cumulative advantage in economics, as the strengthening of repeatedly used connections in neural models, and as *preferential attachment* in network science, where new vertices prefer to connect to vertices that are already well connected. They also appear in AI: a generative model retrained on its own outputs reinforces whatever it already produces most. A central question in such systems is the effect of early advantage: when does early reward lead to the system "locking in" to a particular competitor?

The simplest example is a system of urns: at each step one urn is chosen with probability proportional to a positive, increasing function f of the number of balls in that urn, and gains a ball.

{% include sim-urns.html %}

Six urns with f(k) = (k+1)<sup>α</sup>. The strip shows which urn is ahead at each moment, on a logarithmic time scale from step 10 to step 100,000; grey means a tie at the top. Near α = ½ the lead can take a very long time to settle: the theorem is about what happens eventually.
{: .caption}

It turns out one urn eventually stays strictly ahead forever exactly when ∑ 1/f(k)<sup>2</sup> < ∞. This was known when f is bounded away from zero; I proved it without that assumption, using competing growth processes whose waiting times need not be exponential <a class="cite" href="publications.html#fixation">[SPA 2026]</a>. With Johannes Bäumler, I also showed that the other side of this transition is far more dramatic than a few changes of leader: every ordering of the urns by size recurs infinitely often (as conjectured by Joel Spencer) <a class="cite" href="publications.html#permutations">[arXiv 2025]</a>.

Preferential-attachment trees add a new difficulty, because fresh competitors keep arriving. Here the urns become the vertices of a growing tree, and the question is whether there is a *persistent hub*: a vertex that eventually has the largest degree forever.

{% include sim-pa-tree.html %}

400 vertices arrive one at a time, each attaching to an existing vertex with probability proportional to (k+1)<sup>α</sup>, where k is its number of children. The circled vertex has the largest degree; a persistent hub exists exactly when α > ½, the same threshold as for the urns.
{: .caption}

Viewing the tree as the family tree of a Crump–Mode–Jagers branching process, I gave criteria for a persistent hub, and the same inverse-square condition reappears for attachment functions with f(k) ≤ C(k+1) <a class="cite" href="publications.html#hubs">[arXiv 2024]</a>. It is not universal, though: in some generalised trees, inverse-square summability alone does not give a persistent hub <a class="cite" href="publications.html#counterexample">[ECP 2026]</a>.

The same mechanism appears in learning. A learner that keeps choosing whatever has paid off is a reinforced urn in disguise: every success adds a ball to the option that produced it. Take choice probabilities proportional to (successes + 1)<sup>α</sup>; for α = 1 this is the Roth–Erev model of reinforcement learning. Embedding the learner in continuous time as competing exponential growth processes, the same argument used for the non-linear urns, shows that the threshold is α = 1. Below it, the learner never fully commits, though it favours the better option more and more as α approaches 1. At α = 1 it eventually settles on the better option. Above it, the learner commits quickly, and early luck can decide that it commits to the worse one.

{% include sim-learners.html %}

400 learners, each choosing between options that succeed with probability 0.6 and 0.4 for 2,000 rounds; colour shows the share of the last 500 choices that went to the better one. The right panel repeats this for α from 0.5 to 2: the share locked onto the worse option is zero up to α = 1 and positive beyond it.
{: .caption}

A learning system never sees its true objective, only a feedback signal: a reward model, a benchmark score, or data produced by earlier models. Reinforcement amplifies whatever that signal favours, so a small gap between signal and goal can grow. I am starting to study this with the same tools as above: simple reinforced models, and sharp thresholds for when they lock in.

This is one direction my research is heading: how reinforcement interacts with exploration, with rewards that change over time, and with feedback loops in which a system's own choices shape the data it learns from. My TU Berlin course [Advanced Probabilistic Methods Related to Reinforcement Learning](course-rl-2026.html) (winter 2026/27) develops bandits and Markov decision processes with full mathematical rigour.

## When does mass escape to infinity?

In many growing systems one tracks how “mass” (for example, particle mass, or the edges of a network) is distributed. Sometimes, in the limit, part of that mass vanishes from every finite scale: it has escaped to infinitely large clusters, or to vertices of unbounded degree. When this happens, and where the missing mass goes, are the two questions behind this part of my work.

In a *coagulation process*, clusters merge at a rate K(x, y) depending on their masses. If large clusters merge fast enough, then with high probability a positive fraction of the mass ends up in clusters whose size grows with the system, in a bounded window of time. This is gelation.

{% include sim-gelation.html %}

3,000 particles of unit mass; each pair of clusters merges at rate min(x, y)<sup>γ</sup>/N, so the rate is set by the smaller cluster. Gelation occurs for γ > 1 <a class="cite" href="publications.html#gelation">[AIHP 2026]</a>; for γ ≤ 1 the kernel grows at most linearly, and mass is conserved. Top: the clusters, each drawn as a disc with area proportional to its mass. Positions are for display only, since in this model any two clusters can merge. Bottom: the largest cluster's share of the total mass; previous runs stay on the chart, faded, for comparison.
{: .caption}

With Luisa Andreis and Elena Magnanini I proved criteria for gelation in coagulation processes where clusters carry general types <a class="cite" href="publications.html#gelation">[AIHP 2026]</a>. In a companion paper we proved a law of large numbers for the empirical cluster distribution, with limits described by a generalised Flory equation <a class="cite" href="publications.html#convergence">[EJP 2026]</a>. A key tool in the latter is *conservative functions*: quantities preserved by mergers that keep track of how finite clusters interact with the gel.

The same loss of mass happens in growing networks and random trees, where a positive fraction of all edges in the network can accumulate on vertices whose degree grows without bound. Preferential attachment with fitness is a well-known example. The simulation below shows a version from my work in which a vertex's attractiveness also depends on the fitness of its neighbours <a class="cite" href="publications.html#neighbourhood">[EJP 2022]</a>.

{% include sim-condensation.html %}

Each vertex has a random fitness between 0 and 1; larger β makes very fit vertices rarer. Newcomers attach to a vertex in proportion to a function of its fitness and the fitness of its children, with higher fitness counting for more. By the criterion in <a class="cite" href="publications.html#neighbourhood">[EJP 2022]</a>, condensation occurs exactly when β > √3 − 1 ≈ 0.73.
{: .caption}

I studied condensation and degree distributions in recursive trees with fitness through the lens of Crump–Mode–Jagers branching processes <a class="cite" href="publications.html#fitness">[AAP 2023]</a>, and, with Nikolaos Fountoulakis, condensation in preferential-attachment trees where a vertex's attractiveness also depends on the fitness of its neighbours <a class="cite" href="publications.html#neighbourhood">[EJP 2022]</a>. With Fountoulakis, Cécile Mailler and Henning Sulzbach, I derived degree distributions for higher-dimensional analogues, in which random simplicial complexes grow by preferential attachment <a class="cite" href="publications.html#simplicial">[AAP 2022]</a>. With Bas Lodewijks I studied the limiting tree when degree reinforcement meets extreme fitness values: depending on the tail of the fitness distribution, it contains either a single vertex of infinite degree or, while staying locally finite, a unique infinite path <a class="cite" href="publications.html#genealogy">[arXiv 2023]</a>.

{% include sim-superlinear.html %}

Each vertex has a weight W with P(W ≥ x) = x<sup>1−α</sup> and receives newcomers with probability proportional to (children + 1)<sup>2</sup> + W; the blue path leads to the largest hub. When 2(α − 1) > 1 the edges collect on a single vertex of infinite degree; when 2(α − 1) < 1 they pass along a line of ever larger hubs, and the limiting tree has a single infinite path <a class="cite" href="publications.html#genealogy">[arXiv 2023]</a>.
{: .caption}

## How fast does a population grow?

Branching processes model populations in which individuals have children, in classical models independently of one another. They come in many forms: generation by generation (*Bienaymé–Galton–Watson processes*), in continuous time with individuals giving birth throughout their lives (*Crump–Mode–Jagers processes*), or with individuals also carrying positions in space (*branching random walks*). A recurring question across all of them is *how the population grows*. *Kesten–Stigum-type theorems*, whose modern proofs use spine arguments, say exactly when natural normalisations of the population, such as its size divided by its expected size, converge to a limit that is positive whenever the population survives. I am interested in what replaces this picture *when its assumptions fail*.

A *branching process in a varying environment* (BPVE) is a generation-by-generation branching process whose offspring law changes from one generation to the next. Ordinary Bienaymé–Galton–Watson processes with finite mean have a single, roughly exponential growth rate; a BPVE can have several. This is classical, but in <a class="cite" href="publications.html#varying">[arXiv 2026]</a> I characterised when such a population still has a deterministic *growth scale*, and gave a Kesten–Stigum-type criterion for L<sup>1</sup> convergence of the normalised population martingale. This gives a new proof that such processes can have multiple growth rates, and connects the question to the convergence of random series.

{% include sim-varying.html %}

In generation n, each individual has 2 children, except that with probability 3<sup>−n</sup>/5 it has a jackpot of 20 · 3<sup>n</sup> children, so the mean number of children is close to 6. If no jackpot happens early, later jackpots stay too rare to matter and the population grows like 2<sup>n</sup>. Once one happens, the population is large enough for jackpots to keep happening, and it grows like 6<sup>n</sup>, as its mean does. Both outcomes have positive probability, so no single deterministic growth scale fits every run.
{: .caption}

In continuous time, the natural exponential normalisation can break down completely through *explosion*: infinitely many births in finite time.

{% include sim-explosion.html %}

A Crump–Mode–Jagers process in which each individual has a weight W with P(W > x) = x<sup>−a</sup> and has children at rate W; each line is an individual, linked to its parent. It explodes when a < 1 <a class="cite" href="publications.html#explosion">[ECP 2024]</a> and grows exponentially when a > 1. Its family tree, a weighted random recursive tree, changes shape at the same point: for a < 1 it is locally finite with a single infinite path.
{: .caption}

I gave a simple sufficient condition for explosion in Crump–Mode–Jagers processes and applied it to recursive trees <a class="cite" href="publications.html#explosion">[ECP 2024]</a>; the structure of the family tree at explosion is the subject of the joint work with Lodewijks above <a class="cite" href="publications.html#genealogy">[arXiv 2023]</a>.

## Publications

A full list of publications is on the [publications](publications.html) page.
