---
layout: default
title: "Research"
nav: "research"
sims: true
description: "Research of Tejas Iyer: phase transitions in reinforced growth processes, random trees, coagulation and branching processes, with interactive simulations."
---
# Research

My research is in probability theory and its applications. Key focal points of my work include stochastic growth models with reinforcement and feedback, and random discrete structures such as random graphs and systems of branching and coalescing particles. Such models are the conceptual backbone of models arising in diverse applications, including reinforcement learning algorithms and the structure of complex networks such as the internet. Studying them in idealised form makes it possible to prove exactly how a system's parameters shape its behaviour. They often exhibit tipping points, with dramatically different behaviours depending on parameter choices. A central goal of my research is to provide mathematically precise insights into these *phase transitions*, which are of real significance in applications.
{: .lede}

My work is organised around the three questions below. Each comes with simulations that run in your browser: move the sliders to cross the thresholds yourself.
{: .lede}

## When does an early lead become permanent?

Reinforced processes are models in which past success makes future success more likely. They appear as cumulative advantage in economics, as the strengthening of repeatedly used connections in neural models, and as *preferential attachment* in network science, where new vertices prefer to connect to vertices that are already well connected. A central question in such systems is the effect of early advantage: when does early reward lead to the system "locking in" to a particular competitor?

The simplest example is a system of urns: at each step one urn is chosen with probability proportional to f(its number of balls), and gains a ball.

{% include sim-urns.html %}

Six urns with f(k) = (k+1)<sup>α</sup>. The strip shows which urn is ahead at each moment, on a logarithmic time scale from step 10 to step 100,000; grey means a tie at the top. Near α = ½ the lead can take a very long time to settle: the theorem is about what happens eventually.
{: .caption}

It turns out one urn eventually stays strictly ahead forever exactly when ∑ 1/f(k)<sup>2</sup> < ∞. This was known when f is bounded away from zero; I proved it without that assumption, using competing growth processes whose waiting times need not be exponential <a class="cite" href="publications.html#fixation">[SPA 2026]</a>. With Johannes Bäumler, I also showed that the other side of this transition is far more dramatic than a few changes of leader: every ordering of the urns by size recurs infinitely often <a class="cite" href="publications.html#permutations">[arXiv 2025]</a>.

Preferential-attachment trees add a new difficulty, because fresh competitors keep arriving. Here the urns become the vertices of a growing tree, and the question is whether there is a *persistent hub*: a vertex that eventually has the largest degree forever.

{% include sim-pa-tree.html %}

400 vertices arrive one at a time. Each attaches to an existing vertex chosen with probability proportional to (k+1)<sup>α</sup>, where k is that vertex's number of children; the root sits in the centre and vertex size shows degree. α = 0 gives the uniform random recursive tree, α = 1 the classical preferential-attachment tree with a hierarchy of hubs, and α > 1 a star. At this size the picture shows the mechanism, not the threshold: whether a hub persists is a statement about the infinite tree.
{: .caption}

Viewing the tree as the family tree of a Crump–Mode–Jagers branching process, I gave criteria for a persistent hub, and the same inverse-square condition reappears for attachment functions with f(k) ≤ C(k+1) <a class="cite" href="publications.html#hubs">[arXiv 2024]</a>. It is not universal, though: in some generalised trees, inverse-square summability alone does not give a persistent hub <a class="cite" href="publications.html#counterexample">[ECP 2026]</a>.

The same mechanism appears in learning. A learner that keeps choosing whatever has paid off is a reinforced urn in disguise: every success adds a ball to the option that produced it. Weak reinforcement never commits; strong reinforcement commits quickly, and early luck can decide that it commits to the worse option.

{% include sim-learners.html %}

400 independent learners per panel, each facing two options that succeed with probability 0.6 and 0.4, for 2,000 rounds. Each dot is one learner, coloured by the share of its last 500 choices that went to the better option. “Settled” means at least 90% of those choices went to one option.
{: .caption}

This is one direction my research is heading: how reinforcement interacts with exploration, with rewards that change over time, and with feedback loops in which a system's own choices shape the data it learns from. My TU Berlin course [Advanced Probabilistic Methods Related to Reinforcement Learning](course-rl-2026.html) (winter 2026/27) develops bandits and Markov decision processes with full mathematical rigour.

## When does mass escape to infinity?

In many growing systems one tracks how “mass” (for example, particle mass, or the edges of a network) is distributed. Sometimes, in the limit, part of that mass vanishes from every finite scale: it has escaped to infinitely large clusters, or to vertices of unbounded degree. When this happens, and where the missing mass goes, are the two questions behind this part of my work.

In a *coagulation process*, clusters merge at a rate K(x, y) depending on their masses. If large clusters merge fast enough, a positive fraction of the mass ends up in clusters whose size grows with the system, in finite time. This is gelation.

{% include sim-gelation.html %}

3,000 particles of unit mass; each pair of clusters merges at rate (xy)<sup>γ/2</sup>/N. The curve is the largest cluster's share of the total mass; previous runs stay on the chart, faded, for comparison. A finite simulation can only hint at the infinite-volume transition, but the contrast between a sudden jump and slow growth is already clear.
{: .caption}

With Luisa Andreis and Elena Magnanini I proved criteria for gelation in coagulation processes where clusters carry general types <a class="cite" href="publications.html#gelation">[AIHP 2026]</a>. In a companion paper we proved a law of large numbers for the empirical cluster distribution, with limits described by a generalised Flory equation <a class="cite" href="publications.html#convergence">[EJP 2026]</a>. A key tool in the latter is *conservative functions*: quantities preserved by mergers that keep track of how finite clusters interact with the gel. I am now asking how quickly mass can travel up through the size scales, and, longer term, how gelation can emerge in spatial models where mass only changes how fast a particle moves.

The same loss of mass happens in growing networks and random trees, where a positive fraction of all edges in the network can accumulate on vertices whose degree grows without bound. Preferential attachment with fitness, simulated below, is a well-known example.

{% include sim-condensation.html %}

Each vertex has a fitness W in [0, 1], with density proportional to (1 − w)<sup>β</sup>, and receives each newcomer with probability proportional to W · (children + 1). Larger β makes very fit vertices rarer. For this model, condensation occurs exactly when β > 1.
{: .caption}

I studied condensation and degree distributions in recursive trees with fitness through the lens of Crump–Mode–Jagers branching processes <a class="cite" href="publications.html#fitness">[AAP 2023]</a>, and, with Nikolaos Fountoulakis, condensation in preferential-attachment trees where a vertex's attractiveness also depends on the fitness of its neighbours <a class="cite" href="publications.html#neighbourhood">[EJP 2022]</a>. With Fountoulakis, Cécile Mailler and Henning Sulzbach, I derived degree distributions for higher-dimensional analogues, in which random simplicial complexes grow by preferential attachment <a class="cite" href="publications.html#simplicial">[AAP 2022]</a>. With Bas Lodewijks I studied the limiting tree when degree reinforcement meets extreme fitness values: depending on the tail of the fitness distribution, it contains either a single vertex of infinite degree or, while staying locally finite, a unique infinite path <a class="cite" href="publications.html#genealogy">[arXiv 2023]</a>.

## How fast does a population grow?

Branching processes model populations in which individuals have children, in classical models independently of one another. They come in many forms: generation by generation (Bienaymé–Galton–Watson processes), in continuous time with individuals giving birth throughout their lives (Crump–Mode–Jagers processes), or with individuals also carrying positions in space (branching random walks). A recurring question across all of them is how the population grows. Kesten–Stigum-type theorems, whose modern proofs use spine arguments, say exactly when natural normalisations of the population, such as its size divided by its expected size, converge to a limit that is positive whenever the population survives. I am interested in what replaces this picture when its assumptions fail. In continuous time, the most extreme failure is *explosion*: infinitely many births in finite time.

{% include sim-explosion.html %}

A Crump–Mode–Jagers process in which an individual with k children has its next child at rate f(k) = (k+1)<sup>α</sup>. Each horizontal line is an individual, starting at its birth; vertical links join it to its parent. Exponential growth shows up as a straight line on the right; explosion as a wall, with almost all births packed into a sliver of time.
{: .caption}

I gave a simple sufficient condition for explosion in Crump–Mode–Jagers processes and applied it to recursive trees <a class="cite" href="publications.html#explosion">[ECP 2024]</a>; the structure of the family tree at explosion is the subject of the joint work with Lodewijks above <a class="cite" href="publications.html#genealogy">[arXiv 2023]</a>. When the offspring law changes from one generation to the next, a *branching process in a varying environment*, there can be multiple growth rates to normalise by. I characterised when such a population still has a deterministic growth scale, and gave a Kesten–Stigum-type criterion for L<sup>1</sup> convergence of the normalised population martingale <a class="cite" href="publications.html#varying">[arXiv 2026]</a>.

Open directions I am pursuing: Crump–Mode–Jagers processes with no Malthusian parameter, continuous-time Kesten–Stigum results in non-homogeneous settings, and extinction criteria when reproduction depends on history.

## Other Interests

A full list of publications is on the [publications](publications.html) page.
