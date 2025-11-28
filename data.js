window.HBN_DATA = {
	nav: [
		{ id: 'home', label: 'Home' },
		{ id: 'module1', label: 'Module 1: Neuroeconomics' },
		{ id: 'module3', label: 'Module 3: Environment' },
		{ id: 'module4', label: 'Module 4: Placebo' },
		{ id: 'review', label: 'Revision' }
	],

	home: {
		title: 'Human Behavioral Neuroscience',
		subtitle: 'Interactive study platform for Modules 1, 3, and 4. Explore decision models, socio-cognitive plasticity, and placebo mechanisms.',
		cards: [
			{
				id: 'module1',
				title: 'Module 1: Foundations',
				desc: 'Price vs Value, Game Theory, the Drift Diffusion Model, and choice circuitry (OFC, DLPFC).',
				icon: '🧠',
				color: 'teal'
			},
			{
				id: 'module3',
				title: 'Module 3: Environment & Tech',
				desc: 'Plasticity (Taxi Drivers), the impact of Social Media, Videogaming, and the Google Effect.',
				icon: '📱',
				color: 'violet'
			},
			{
				id: 'module4',
				title: 'Module 4: Clinical & Placebo',
				desc: 'Clinical Trials, Open-Hidden paradigms, and the neurochemistry of expectation (Opioids, CCK).',
				icon: '💊',
				color: 'amber'
			},
			{
				id: 'review',
				title: 'Revision Area',
				desc: 'Access the complete database of questions and answers for exam preparation.',
				icon: '📚',
				color: 'rose'
			}
		]
	},

	module1: {
		intro: {
			title: 'Module 1: Neuroeconomics & Decision Making',
			text: 'Integrates neuroscience, economics, and psychology to explain how the brain evaluates options (Valuation), selects actions (Choice), and learns from outcomes (Learning).',
			color: 'teal'
		},
		definitions: [
			{ title: 'Price vs Value', text: 'Price is the objective market amount. Subjective Value is the perceived utility encoded in the vmPFC/OFC as a common currency.' },
			{ title: 'Allais Paradox', text: 'Violates the independence axiom of EUT. Reveals the Certainty Effect: people overweight certain gains (100%) in a non-linear fashion.' },
			{ title: 'Ultimatum Game', text: 'Responders reject unfair offers (<20%) to punish norm violations. Rejection correlates with anterior insula activation (disgust/negative affect).' }
		],
		sections: [
			{
				type: 'mixed-content',
				title: 'Prospect Theory and Framing',
				desc: 'Kahneman & Tversky: choices depend on a reference point. We are risk-averse in the gain domain (concavity) and risk-seeking in the loss domain (convexity).',
				wiki: ['M1-Q05', 'M1-Q06'],
				textBlocks: [
					{ title: 'Loss Aversion', text: 'The value function is steeper for losses: losses hurt more than equivalent gains please (lambda ≈ 2.25).' },
					{ title: 'Reflection Effect', text: 'Risk seeking to avoid a sure loss versus risk aversion to secure a sure gain.' }
				],
				chartId: 'chartFraming',
				chartCaption: 'Choice percentages in the Asian Disease problem (Gain vs Loss frame).'
			},
			{
				type: 'text-block',
				title: 'Methods in Neuroeconomics',
				wiki: ['M1-Q14', 'M1-Q15', 'M1-Q16'],
				content: `
					<ul class="list-disc pl-6 space-y-2 text-stone-700">
						<li><strong>fMRI:</strong> Excellent spatial resolution (mm), poor temporal resolution (s). Indirect haemodynamic measure.</li>
						<li><strong>EEG/ERP:</strong> Excellent temporal resolution (ms), poor spatial precision. Ideal for timing signals (for example, ERN).</li>
						<li><strong>TMS:</strong> Enables <em>causal</em> inference by transiently interrupting cortical areas (for example, dlPFC).</li>
						<li><strong>Single-Unit:</strong> Highest spatiotemporal precision but invasive (animal models).</li>
						<li><strong>Lesion Studies:</strong> Essential to establish the <em>necessity</em> of a region (for example, vmPFC and the Iowa Gambling Task).</li>
					</ul>
				`
			},
			{
				type: 'chart-section',
				title: 'Perceptual Processing and DDM',
				desc: 'Newsome (Random Dot) and Heekeren (Face/House) show decisions as noisy evidence accumulation over time until a bound.',
				wiki: ['M1-Q18', 'M1-Q19', 'M1-Q20'],
				chartId: 'chartDDM'
			},
			{
				type: 'interactive-brain',
				title: 'Neural Circuits of Choice',
				wiki: ['M1-Q27', 'M1-Q30', 'M1-Q31', 'M1-Q32'],
				nodes: [
					{
						label: 'OFC / vmPFC',
						sub: 'Valuation',
						text: 'Encodes integrated Subjective Value independent of motor action (Padoa-Schioppa). Lesions cause socio-emotional decision deficits (Gage) and future myopia.',
						meta: 'Module 1'
					},
					{
						label: 'DLPFC',
						sub: 'Executive Control',
						text: 'Acts as the evidence comparator (Heekeren) and maintains rules (impulse inhibition). TMS disruption during the Ultimatum Game yields acceptance of unfair offers.',
						meta: 'Module 1'
					},
					{
						label: 'ACC',
						sub: 'Monitoring',
						text: 'Detects conflict and errors. Generates the ERN (Error Related Negativity) to recalibrate top-down control.',
						meta: 'Module 1'
					}
				]
			},
			{
				type: 'mixed-content',
				title: 'Neurochemical Modulation',
				desc: 'How neurotransmitters influence the routing of information from OFC to PFC.',
				wiki: ['M1-Q21', 'M1-Q22', 'M1-Q23', 'M1-Q24'],
				textBlocks: [
					{ title: 'Dopamine (DA)', text: 'Reward prediction error and incentive salience ("wanting"). Facilitates the basal ganglia direct (Go) pathway.' },
					{ title: 'Serotonin (5-HT)', text: 'Cost evaluation and patience. Counterbalances dopamine, modulating the temporal horizon.' },
					{ title: 'NAcc Role', text: 'Motivation-action interface. Activated by gain anticipation (Knutson) and motivational salience.' }
				],
				chartId: 'chartExecFlow',
				chartCaption: 'Simplified model of regional contributions.'
			},
			{
				type: 'study-guide',
				title: 'Price, Value & Utility',
				desc: 'Consolidated explanations of how price, cost, value, utility, and the decision pipeline interact in Module 1.',
				ids: ['M1-Q01', 'M1-Q02', 'M1-Q03', 'M1-Q04', 'M1-Q13']
			},
			{
				type: 'study-guide',
				title: 'Biases and Strategic Games',
				desc: 'Prospect Theory, Allais paradoxes, and bargaining games framed with the full text answers.',
				ids: ['M1-Q05', 'M1-Q06', 'M1-Q07', 'M1-Q08', 'M1-Q09', 'M1-Q10', 'M1-Q11', 'M1-Q12']
			},
			{
				type: 'study-guide',
				title: 'Methods & Evidence Accumulation',
				desc: 'From measurement trade-offs to drift diffusion experiments (Newsome, Heekeren).',
				ids: ['M1-Q14', 'M1-Q15', 'M1-Q16', 'M1-Q17', 'M1-Q18', 'M1-Q19', 'M1-Q20']
			},
			{
				type: 'study-guide',
				title: 'Circuitry and Lesion Evidence',
				desc: 'Detailed pathways linking OFC, basal ganglia, lesion syndromes, and monitoring hubs.',
				ids: ['M1-Q21', 'M1-Q22', 'M1-Q23', 'M1-Q24', 'M1-Q25', 'M1-Q26', 'M1-Q27', 'M1-Q28', 'M1-Q29', 'M1-Q30', 'M1-Q31', 'M1-Q32']
			},
			{
				type: 'exam-checklist',
				title: 'Module 1 Exam Checklist',
				desc: 'Flag each question once you can deliver a rigorous answer without consulting the notes.',
				moduleRef: 'Module 1',
				accent: 'teal',
				questions: [
					{ id: 'M1-Q01', text: 'What is price?' },
					{ id: 'M1-Q02', text: 'What is cost?' },
					{ id: 'M1-Q03', text: 'What is value?' },
					{ id: 'M1-Q04', text: 'What is the utility function?' },
					{ id: 'M1-Q05', text: 'What is the Allais Paradox?' },
					{ id: 'M1-Q06', text: 'What\'s Kahneman and Tversky\'s theory about framing? What did they discover?' },
					{ id: 'M1-Q07', text: 'Which are the characteristics of game theory experiments?' },
					{ id: 'M1-Q08', text: 'What are the Prisoner\'s Dilemma games? What are the early findings?' },
					{ id: 'M1-Q09', text: 'What are the Ultimatum Games? Which are the key results?' },
					{ id: 'M1-Q10', text: 'What is the difference between macroeconomics and microeconomics?' },
					{ id: 'M1-Q11', text: 'Which are the funding elements of neuroeconomics?' },
					{ id: 'M1-Q12', text: 'What is the difference between a descriptive and a normative theory? Is neuroeconomics a descriptive theory, a normative theory or is it mixed?' },
					{ id: 'M1-Q13', text: 'Which are the stages of decision process?' },
					{ id: 'M1-Q14', text: 'What is the difference between spatial and temporal resolution? Which instruments are better suitable for a better spatial resolution? Which for a better temporal resolution?' },
					{ id: 'M1-Q15', text: 'What is the difference between static and dynamic measurements?' },
					{ id: 'M1-Q16', text: 'What are the main methods used for exploring neuroeconomics? What are the pro and cons of each method?' },
					{ id: 'M1-Q17', text: 'What is Chersi et al study about? Which is the role of the inferior part of the parietal lobe (IPL)?' },
					{ id: 'M1-Q18', text: 'What is the Newsome (1989) study about? What is the perceptual discrimination task?' },
					{ id: 'M1-Q19', text: 'What are diffusion models? Which brain areas are involved?' },
					{ id: 'M1-Q20', text: 'What is the Heekeren et al (2004) study about? What is perceptual decision making? What happens in the brain? What is the role of the ventral temporal cortex? And what about dlPFC? Is causality proven? How?' },
					{ id: 'M1-Q21', text: 'How do dopaminergic, serotonergic, and cholinergic signals modulate the value representations computed in the orbitofrontal cortex, and in what ways do these modulatory effects shape the routing of information toward the lateral and medial prefrontal cortices during decision-making?' },
					{ id: 'M1-Q22', text: 'In what ways can the amygdala and hippocampus reshape the dorsal flow of information across prefrontal regions, and how do these limbic influences alter premotor and parietal planning processes, affecting the selection and execution of behaviour?' },
					{ id: 'M1-Q23', text: 'Considering the contribution of cortico-basal ganglia loops, explain how these circuits interact with the sensory -> OFC -> PFC -> premotor/parietal pathway to refine behavioural choice among competing alternatives, and discuss how a dysregulated dopaminergic system would disrupt this integrated architecture.' },
					{ id: 'M1-Q24', text: 'What is the main role of the NAcc?' },
					{ id: 'M1-Q25', text: 'What are the Tobler et al study\'s discoveries?' },
					{ id: 'M1-Q26', text: 'What are the Knutson et al study\'s findings?' },
					{ id: 'M1-Q27', text: 'What is the role of the orbitofrontal cortex?' },
					{ id: 'M1-Q28', text: 'What are the main findings of the Padoa-Schioppa studies?' },
					{ id: 'M1-Q29', text: 'How can comparing the behaviour of patients with specific brain lesions to healthy control groups help us understand the functions of the damaged brain regions?' },
					{ id: 'M1-Q30', text: 'What happens in patients with vmPFC impairment?' },
					{ id: 'M1-Q31', text: 'What is the role of the dlPFC? What happens when is disrupted?' },
					{ id: 'M1-Q32', text: 'What is the role of ACC? What about the ERN?' }
				]
			}
		]
	},

	module3: {
		intro: {
			title: 'Module 3: Environment, Plasticity & Tech',
			text: 'Explores how enriched and digital environments structurally sculpt the brain (neuroplasticity) and influence hormones and cognition.',
			color: 'violet'
		},
		definitions: [
			{ title: 'Enriched Environments', text: 'Sensory/motor/social stimulation. Delays motor symptom onset in Huntington models (van Dellen) via BDNF pathways.' },
			{ title: 'Google Effect', text: 'Sparrow et al.: Digital transactive memory prioritises remembering "where" to retrieve information rather than "what" it is.' },
			{ title: 'Transactive Memory', text: 'Externalisation of memory on digital media, lowering internal load yet fragmenting learning.' }
		],
		sections: [
			{
				type: 'mixed-content',
				title: 'Structural Plasticity: Taxi Drivers',
				desc: 'Maguire et al.: The posterior hippocampus (spatial navigation) enlarges with experience, at the expense of the anterior portion.',
				wiki: ['M3-Q01', 'M3-Q02', 'M3-Q03', 'M3-Q04'],
				textBlocks: [
					{ title: 'The Knowledge', text: 'Mastering London\'s map drives adult plasticity.' },
					{ title: 'Musicians', text: 'Auditory and motor cortices expand according to age of practice onset (Elbert).' },
					{ title: 'Mathematicians', text: 'Increased density in the inferior parietal lobe (Aydin).' }
				],
				chartId: 'chartMaguire',
				chartCaption: 'Correlation between posterior hippocampal volume and years of experience.'
			},
			{
				type: 'chart-section',
				title: 'Sociality and Hormones (Seltzer 2012)',
				desc: 'Compare stress recovery (cortisol) and bonding (oxytocin) across communication modes.',
				wiki: ['M3-Q07'],
				chartId: 'chartHormones'
			},
			{
				type: 'text-block',
				title: 'The Seltzer Case (Details)',
				wiki: ['M3-Q07'],
				content: '<p>The study showed that instant messages <strong>do not</strong> stimulate oxytocin release nor reduce cortisol, unlike phone or in-person contact. Text-only channels omit the prosodic cues required for social buffering.</p>'
			},
			{
				type: 'grid-cards',
				title: 'Videogaming & Brain',
				wiki: ['M3-Q05', 'M3-Q06', 'M3-Q08', 'M3-Q09', 'M3-Q10', 'M3-Q11', 'M3-Q12', 'M3-Q13', 'M3-Q14'],
				items: [
					{ icon: '🎮', title: 'Craving & Dopamine', text: 'Gaming releases striatal dopamine. Game cues trigger craving akin to addictions (Weinstein).' },
					{ icon: '🔫', title: 'Arousal: FPS vs MMORPG', text: 'FPS titles elicit high autonomic arousal (HR, BP), whereas MMORPGs can induce relaxation or social flow.' },
					{ icon: '🥊', title: 'Aggression', text: 'Short-term priming (aggressive thoughts, noise blasts) tied to hypoactive PFC control and hyperactive amygdala.' },
					{ icon: '👀', title: 'Attention', text: 'Benefits: selective attention, multi-object tracking. Costs: impulsivity and reduced proactive control (multitasking).' }
				]
			},
			{
				type: 'chart-section',
				title: 'Arousal in Gamers',
				desc: 'Compare autonomic activation levels across videogame genres.',
				wiki: ['M3-Q10'],
				chartId: 'chartDigitalArousal'
			},
			{
				type: 'study-guide',
				title: 'Experience-Dependent Plasticity',
				desc: 'Enriched environments, Huntington models, and expert brains (taxi drivers, musicians, mathematicians).',
				ids: ['M3-Q01', 'M3-Q02', 'M3-Q03', 'M3-Q04']
			},
			{
				type: 'study-guide',
				title: 'Hormones & Social Technology',
				desc: 'NAcc "likes" effect, dopamine triggers, and Seltzer\'s endocrine findings.',
				ids: ['M3-Q05', 'M3-Q06', 'M3-Q07']
			},
			{
				type: 'study-guide',
				title: 'Reward, Craving, and Aggression',
				desc: 'Videogame craving hypotheses, the chicken-and-egg dilemma, arousal, and aggression biomarkers.',
				ids: ['M3-Q08', 'M3-Q09', 'M3-Q10', 'M3-Q11', 'M3-Q12', 'M3-Q13']
			},
			{
				type: 'study-guide',
				title: 'Attention, Memory & the Google Effect',
				desc: 'Digital-era cognition: attention trade-offs, transactive memory, and remembering "where" vs "what".',
				ids: ['M3-Q14', 'M3-Q15', 'M3-Q16', 'M3-Q17']
			},
			{
				type: 'process-flow',
				title: 'Transactive Memory Loop',
				desc: 'From detecting a knowledge gap to encoding pointers to external archives, summarising the digital-era learning cycle.',
				wiki: ['M3-Q15', 'M3-Q16', 'M3-Q17'],
				orientation: 'horizontal',
				steps: [
					{ title: 'Gap Detection', detail: 'Recognise a missing fact and trigger search intent rather than deep encoding (digital world effects on learning).' },
					{ title: 'External Retrieval', detail: 'Immediate access to networked databases shifts effort toward locating trusted repositories (Google Effect).' },
					{ title: 'Pointer Storage', detail: 'Memory prioritises “where” information resides (folder, search terms) instead of the semantic payload.' },
					{ title: 'On-Demand Recall', detail: 'Future questions reactivate the pointer, rapidly reconstructing the answer by revisiting the external source.' }
				]
			},
			{
				type: 'interactive-list',
				title: 'Google Effect Evidence Base',
				desc: 'Key experiments from Sparrow et al. detailing how memory reallocates resources when digital archives are reliable.',
				accent: 'violet',
				wiki: ['M3-Q16', 'M3-Q17'],
				items: [
					{
						title: 'Experiment 1 – Stroop Priming',
						summary: 'Unanswered trivia slows colour-naming for computer terms, meaning the concept of search engines becomes more accessible.',
						detail: 'Participants exposed to difficult trivia subsequently took longer to name the colour of words such as “Google”, evidencing automatic readiness to consult digital aids when knowledge gaps appear.'
					},
					{
						title: 'Experiment 2 – Save vs Delete',
						summary: 'Believing statements will be saved reduces verbatim recall yet increases memory for storage locations.',
						detail: 'When told that trivia entries would remain available, students forgot the content but remembered whether it sat in a specific folder, confirming outsourcing of semantic load to the cloud.'
					},
					{
						title: 'Experiment 4 – What vs Where',
						summary: 'Participants preferentially recalled folder names over the statements they contained.',
						detail: 'Typing facts into labelled folders led to superior recall for the folder labels, underscoring the shift toward spatial/organisational memory rather than semantic storage.'
					}
				]
			},
			{
				type: 'exam-checklist',
				title: 'Module 3 Exam Checklist',
				desc: 'Ensure mastery of every environment and technology question before the oral assessment.',
				moduleRef: 'Module 3',
				accent: 'violet',
				questions: [
					{ id: 'M3-Q01', text: 'What are enriched environments?' },
					{ id: 'M3-Q02', text: 'What did van Dellen discover (related to Huntington\'s Corea) using enriched environments?' },
					{ id: 'M3-Q03', text: 'What is the London Taxi Drivers experiment? What are the main findings? Which NS structures are involved?' },
					{ id: 'M3-Q04', text: 'What can we learn from the musicians and mathematicians\' studies?' },
					{ id: 'M3-Q05', text: 'What is the like effect? Which are the brain areas involved? What is the role of NAcc?' },
					{ id: 'M3-Q06', text: 'What is the dopamine effect? What are the dopamine triggers?' },
					{ id: 'M3-Q07', text: 'What is the Seltzer et al (2012) study about? What are the main findings? What is the effect of technology-mediated communication regarding our endocrine system?' },
					{ id: 'M3-Q08', text: 'What are the effects of videogaming on our reward system? What is the craving hypothesis? Which is the main evidence found in this study?' },
					{ id: 'M3-Q09', text: 'What is the chicken and egg\'s dilemma? Who was born first? The chicken or the egg? Which brain areas are involved?' },
					{ id: 'M3-Q10', text: 'What is the link between dopamine, arousal and videogaming? What is the difference -- in brain activation -- between FPS and MMORPG? What are the effects of the repetition on the autonomic system?' },
					{ id: 'M3-Q11', text: 'What is the level of behavioural aggression in videogamers?' },
					{ id: 'M3-Q12', text: 'What are the physiological effects of violent videogames?' },
					{ id: 'M3-Q13', text: 'What are the brain correlates of aggression?' },
					{ id: 'M3-Q14', text: 'What is the effect of gaming on attention? Which are the benefits and which the deficits?' },
					{ id: 'M3-Q15', text: 'What are the effects of the digital world on memory and learning?' },
					{ id: 'M3-Q16', text: 'What is the Google effect? What study did find it out? What are the implications?' },
					{ id: 'M3-Q17', text: 'What is the difference between remembering "what" vs "where"? What can be concluded?' }
				]
			}
		]
	},

	module4: {
		intro: {
			title: 'Module 4: Clinical Trials & Placebo',
			text: 'Rigorous analysis of clinical trials and the psychobiological mechanisms (Expectation, Conditioning) underlying placebo and nocebo.',
			color: 'amber'
		},
		definitions: [
			{ title: 'Placebo Effect', text: 'Positive therapeutic outcome driven by psychosocial context (expectation/conditioning), not by the active principle.' },
			{ title: 'Nocebo Effect', text: 'Adverse outcome driven by negative expectations or anxiety, often mediated by cholecystokinin (CCK).' },
			{ title: 'Gold Standard', text: 'Randomised clinical trials (RCTs), double-blind, placebo-controlled.' }
		],
		sections: [
			{
				type: 'process-flow',
				title: 'Expectation-to-Analgesia Axis',
				desc: 'Maps how psychosocial cues become neurochemical outputs underpinning placebo and motor benefits.',
				wiki: ['M4-Q05', 'M4-Q06', 'M4-Q07', 'M4-Q08'],
				orientation: 'horizontal',
				steps: [
					{ title: 'Expectation Assembly (dlPFC)', detail: 'Verbal suggestion and prior experience engage dlPFC working memory to hold the analgesic set, an essential prerequisite for both pain and motor placebo.' },
					{ title: 'Valuation Hub (vmPFC/ACC)', detail: 'Signals project to vmPFC and rostral ACC, where prediction errors are minimised and context is integrated to decide whether descending control should be deployed.' },
					{ title: 'Descending Control (PAG/RVM)', detail: 'Periaqueductal grey and rostroventral medulla release endogenous opioids; CCK can antagonise this stream to create nocebo hyperalgesia.' },
					{ title: 'Effector Systems', detail: 'Spinal cord and basal ganglia gating suppress nociception and liberate dopamine in striatum, explaining the motor placebo and fatigue dissociation reported by Pollo et al.' }
				]
			},
			{
				type: 'accordion-group',
				title: 'Pharmacological Probes & Biomarkers',
				desc: 'Antagonists, agonists, and tracers used to dissect placebo and nocebo pathways.',
				wiki: ['M4-Q02', 'M4-Q03', 'M4-Q04', 'M4-Q05', 'M4-Q09', 'M4-Q10'],
				items: [
					{ title: 'Naloxone (Opioid Antagonist)', detail: 'Blocks expectation-driven placebo analgesia in both humans and mice (Guo et al.), proving endogenous opioids mediate the effect.' },
					{ title: 'Proglumide vs Pentagastrin', detail: 'Proglumide antagonises CCK-A/B receptors, dampening nocebo anxiety and potentiating placebo; Pentagastrin (CCK agonist) induces hyperalgesia by inhibiting opioid release.' },
					{ title: 'Cannabinoid Axis & Rimonabant', detail: 'Conditioning with NSAIDs recruits endocannabinoids; CB1 antagonist Rimonabant abolishes this non-opioid placebo analgesia.' },
					{ title: 'Immunosuppression (Goebel 2002)', detail: 'Cyclosporine A paired with a flavoured drink conditions IL-2 and IFN-gamma suppression, showing placebo control over the immune system.' },
					{ title: 'Raclopride PET Signatures', detail: 'de la Fuente-Fernandez demonstrated ventral striatum dopamine release for expectation and dorsal striatum release for clinical improvement in Parkinson\'s disease.' }
				]
			},
			{
				type: 'chart-section',
				title: 'Dopamine Readouts in Placebo',
				desc: 'PET-derived differences between expectation (ventral striatum) and clinical improvement (dorsal striatum).',
				wiki: ['M4-Q09', 'M4-Q10'],
				chartId: 'chartParkinsonDopamine'
			},
			{
				type: 'process-flow',
				title: 'Clinical Trial Timeline',
				desc: 'Phases I–IV with their scientific questions and regulatory deliverables.',
				wiki: ['M4-Q01', 'M4-Q16', 'M4-Q17'],
				orientation: 'vertical',
				steps: [
					{ title: 'Phase I – First-in-Human', detail: 'Tens of participants; safety, tolerability, and pharmacokinetics (ADME) profiling.' },
					{ title: 'Phase II – Proof of Concept', detail: 'Hundreds; dose-ranging efficacy, side effects, and preliminary comparator studies.' },
					{ title: 'Phase III – Pivotal RCT', detail: 'Thousands; randomised, double-blind, placebo-controlled trials establishing superiority or non-inferiority.' },
					{ title: 'Phase IV – Pharmacovigilance', detail: 'Post-marketing surveillance to detect rare AEs, context interactions, and long-term outcomes.' }
				]
			},
			{
				type: 'interactive-list',
				title: 'Methodology, Context, and Statistical Hygiene',
				desc: 'Interactive digest of every design safeguard and psychological mechanism requested in the exam.',
				accent: 'amber',
				wiki: ['M4-Q12', 'M4-Q13', 'M4-Q14', 'M4-Q15', 'M4-Q16', 'M4-Q17', 'M4-Q18', 'M4-Q19', 'M4-Q20', 'M4-Q21', 'M4-Q22', 'M4-Q23', 'M4-Q24'],
				items: [
					{ title: 'Pharmacodynamics vs Pharmacokinetics', summary: 'Differentiate what the drug does to the body from what the body does to the drug.', detail: 'Pharmacodynamics = receptor mechanisms and physiological effects; Pharmacokinetics = absorption, distribution, metabolism, and excretion. Both are needed to interpret placebo-adjusted outcomes.' },
					{ title: 'Purpose of Placebos', summary: 'Why inert controls are administered in RCTs.', detail: 'Placebos quantify non-specific effects so that the specific efficacy of the active principle can be isolated; clinical practice may instead harness the placebo to enhance healing.' },
					{ title: 'Natural Remission & Regression to the Mean', summary: 'Spontaneous improvement can masquerade as treatment success.', detail: 'Symptoms measured at their worst tend to drift toward the average (regression). Natural remission proceeds irrespective of intervention, so both must be subtracted from active arms.' },
					{ title: 'Randomisation & Blinding', summary: 'Gold-standard bias suppression.', detail: 'Random allocation plus double blinding (patient and experimenter unaware) prevent expectancy and allocation biases; these underpin the RCT gold standard.' },
					{ title: 'Context Amplifiers', summary: 'Colour, branding, clinician warmth, and architecture modulate outcomes.', detail: 'Placebo is fundamentally a context effect; richer sensory cues and empathetic clinicians up-regulate expectations and analgesia.' },
					{ title: 'Placebo Run-in Phases', summary: 'Filter out high responders before randomisation.', detail: 'Administer placebo to all, remove those who improve markedly, and then randomise the remainder to reduce noise (with the trade-off of reduced external validity).' },
					{ title: 'Cross-over & Balanced Designs', summary: 'Each participant acts as their own control.', detail: 'Balanced placebo designs orthogonally manipulate instruction (told drug/placebo) and actual substance received; cross-over sequences drug and placebo with washouts.' },
					{ title: 'Open-Hidden Paradigm', summary: 'Quantify pure expectation.', detail: 'Comparing an openly administered drug with a covert infusion isolates the psychological component powering placebo responses.' },
					{ title: 'Psychological Mechanisms & Bayesian View', summary: 'Expectation plus conditioning drive the effect.', detail: 'Top-down priors (expectations) combine with bottom-up evidence; prediction errors either update beliefs or are immunised against when priors are strong.' },
					{ title: 'Expectation Violations', summary: 'What if the outcome contradicts the cue?', detail: 'Prediction errors trigger learning; if the violation is surprising and repeated, extinction of the placebo response ensues, whereas protective beliefs can shield priors and generate nocebo reactions.' },
					{ title: 'Classical Conditioning Phases', summary: 'Acquisition versus evocation.', detail: 'A neutral CS paired with an active US during acquisition later elicits the conditioned response alone; extinction weakens but does not erase the trace (spontaneous recovery evidences latent learning).' },
					{ title: 'Motor Placebo & Fatigue', summary: 'Explains the Pollo paradigm.', detail: 'Expectation alone increases repetitions but does not cut fatigue; conditioning (hidden reduction of load) is required to actually shift perceived effort.' }
				]
			},
			{
				type: 'chart-section',
				title: 'Conditioning Dose-Response',
				desc: 'More pre-conditioning sessions yield stronger and longer Parkinson improvements.',
				wiki: ['M4-Q08', 'M4-Q11'],
				chartId: 'chartConditioningDose'
			},
			{
				type: 'chart-section',
				title: 'Hormonal Mimicry',
				desc: 'Placebo mimics Sumatriptan by increasing GH and lowering cortisol only after conditioning.',
				wiki: ['M4-Q09'],
				chartId: 'chartHormonePlacebo'
			},
			{
				type: 'exam-checklist',
				title: 'Module 4 Exam Checklist',
				desc: 'Mark each question covering clinical trials and placebo neurobiology.',
				moduleRef: 'Module 4',
				accent: 'amber',
				questions: [
					{ id: 'M4-Q01', text: 'What are clinical trials?' },
					{ id: 'M4-Q02', text: 'What is Naloxone? Does it work only in humans?' },
					{ id: 'M4-Q03', text: 'What is proglumide? What is pentagastrin?' },
					{ id: 'M4-Q04', text: 'What about the cannabinoids receptors? What is rimonabant?' },
					{ id: 'M4-Q05', text: 'What is the placebo effect? What is the nocebo effect? How do placebo and nocebo effects engage different neurochemical systems (opioid, cannabinoid, and CCK), and how can pharmacological blockers reveal the specific pathways involved in placebo-induced analgesia or nocebo-induced hyperalgesia?' },
					{ id: 'M4-Q06', text: 'What is the role of the ACC? And of the prefrontal lobe? What about the dlPFC?' },
					{ id: 'M4-Q07', text: 'What is the motor placebo?' },
					{ id: 'M4-Q08', text: 'What is the conditioning protocol in the placebo paradigm? Do the fatigue levels remain constant?' },
					{ id: 'M4-Q09', text: 'What is immunosuppression? What are the main findings of Goebel et al (2002) study? What are the hormonal changes?' },
					{ id: 'M4-Q10', text: 'What are de la Fuente-Fernandez et al (2001) main findings? What are the improvements in PET studies? What is Raclopride? What is the difference between clinical improvement and expectation of beneficial?' },
					{ id: 'M4-Q11', text: 'What is the correlation between conditioning and the strength and duration of the placebo effect?' },
					{ id: 'M4-Q12', text: 'What is the difference between pharmacodynamics and pharmacokinetics?' },
					{ id: 'M4-Q13', text: 'For what is the placebo administered?' },
					{ id: 'M4-Q14', text: 'What is natural remission? Does it occur when I administer placebos?' },
					{ id: 'M4-Q15', text: 'What is the regression to the mean?' },
					{ id: 'M4-Q16', text: 'What is the difference between non-randomised and randomised clinical trials? What is the difference between single and double blinding?' },
					{ id: 'M4-Q17', text: 'What are the gold standards of the neuroeconomics clinical trials? Which are the clinical trial phases?' },
					{ id: 'M4-Q18', text: 'How does the placebo effect correlate to the context?' },
					{ id: 'M4-Q19', text: 'What are placebo run-in trials?' },
					{ id: 'M4-Q20', text: 'What is a cross-over design? What a balanced design?' },
					{ id: 'M4-Q21', text: 'What is the open-hidden paradigm?' },
					{ id: 'M4-Q22', text: 'Which are the psychological mechanisms involved in the placebo effect? What does it bring to the table the Bayesian perspective?' },
					{ id: 'M4-Q23', text: 'What happens when expectations are violated?' },
					{ id: 'M4-Q24', text: 'What is classical conditioning? What its phases?' }
				]
			}
		]
	},

	review: {
		intro: {
			title: 'General Revision',
			text: 'Use this module to assess your mastery of all covered topics.',
			color: 'rose'
		},
		,
		rtf_aliases: {
			'RTF:Q2.2': 'M1-Q02',
			'RTF:Q4.2': 'M1-Q09',
			'RTF:Q5.2': 'M1-Q05',
			'RTF:Q9.2': 'M1-Q09',
			'RTF:Q7.2': 'M1-Q07',
			'RTF:Q10.2': 'M1-Q21'
		}
	};
				type: 'text-block',
				title: 'Revision Playbook',
				content: `
					<ul class="list-disc pl-6 space-y-2 text-stone-700">
						<li><strong>Process Flow:</strong> Start with diagnostics, then move into targeted retrieval and stress tests.</li>
						<li><strong>Interactive Lists:</strong> Use the curated booster sets to interleave concepts from Modules 1, 3, and 4.</li>
						<li><strong>MCQ Browser:</strong> Isolate factual blind spots with immediate answer reveal.</li>
						<li><strong>Prompt Explorer:</strong> Transition to essay-grade explanations before facing viva-style grilling.</li>
						<li><strong>Exam Checklists:</strong> Track completion status so no question ID is left unanswered.</li>
					</ul>
				`
			},
			{
				type: 'process-flow',
				title: 'Revision Workflow',
				desc: 'Loop diagnostics, remediation, retrieval, and stress-testing until confident across modules.',
				wiki: ['M1-Q13', 'M3-Q15', 'M4-Q22'],
				orientation: 'horizontal',
				steps: [
					{ title: 'Diagnose', detail: 'Scan the MCQ browser for weak IDs (for example, M1-Q05, M3-Q07, M4-Q05) and log which answers feel shaky.' },
					{ title: 'Remediate', detail: 'Jump into the Prompt Explorer or source documents to rebuild the narrative behind each concept (value pipelines, Google Effect, placebo neurochemistry).' },
					{ title: 'Retrieve', detail: 'Force active recall using the interactive lists and question toggles without peeking at solutions.' },
					{ title: 'Stress Test', detail: 'Run through exam checklists under timed conditions and rehearse oral explanations until fluent.' }
				]
			},
			{
				type: 'accordion-group',
				title: 'Resource Shortcuts',
				desc: 'Select the right tool for the kind of gap you need to close.',
				wiki: ['M1-Q14', 'M3-Q16', 'M4-Q17'],
				items: [
					{ title: 'MCQ Browser', detail: 'Filter by module to rehearse definitions and study outcomes. Great for rapid-fire checks on instrumentation (M1-Q14–Q20) or clinical design (M4-Q12–Q17).' },
					{ title: 'Prompt Explorer', detail: 'Use when you must narrate complex chains such as enriched environment plasticity (M3-Q01–Q04) or Bayesian placebo mechanisms (M4-Q21–Q24).' },
					{ title: 'Exam Checklists', detail: 'Track oral readiness; mark items complete only after delivering the answer aloud without notes.' }
				]
			},
			{
				type: 'interactive-list',
				title: 'Cross-Module Booster Sets',
				desc: 'Pre-built study playlists interleaving the most error-prone question families.',
				accent: 'rose',
				wiki: ['M1-Q05', 'M3-Q07', 'M4-Q05', 'M4-Q21'],
				items: [
					{ title: 'Value & Context Coupling', summary: 'Fuse prospect theory with placebo framing.', detail: 'Alternate M1-Q05–Q09 with M4-Q18–Q21 to map how framing, expectation, and context co-produce behaviour.' },
					{ title: 'Plasticity Meets Conditioning', summary: 'Link enrichment and Google Effect to placebo learning loops.', detail: 'Cycle through M3-Q01–Q04, M3-Q15–Q17, and M4-Q05–Q08 to see how experience sculpts both structure and expectation.' },
					{ title: 'Methodology Stack', summary: 'Bridge measurements, hormones, and trial design.', detail: 'Review M1-Q14–Q20, pair with M3-Q07–Q13 hormonal/digital biomarkers, then tackle M4-Q12–Q17 to keep analytical rigor intact.' }
				]
			},
			{
				type: 'question-browser',
				title: 'Multiple-Choice Questions (MCQ)',
				desc: 'Complete repository of exam items with answer keys and filters.'
			},
			{
				type: 'prompt-explorer',
				title: 'Open Questions & Extended Responses',
				desc: 'Explore discursive prompts alongside their detailed answers to rehearse oral delivery.'
			},
			{
				type: 'exam-checklist',
				title: 'Global Oral Exam Checklist',
				desc: 'One tracker spanning the highest-yield questions across modules.',
				moduleRef: 'Revision',
				accent: 'rose',
				questions: [
					{ id: 'M1-Q05', text: 'Explain the Allais paradox and what it reveals about certainty bias.' },
					{ id: 'M1-Q14', text: 'Compare spatial vs temporal resolution across the primary neuroimaging tools.' },
					{ id: 'M1-Q27', text: 'Describe the orbitofrontal cortex role in subjective value and cite a lesion finding.' },
					{ id: 'M3-Q03', text: 'Summarise the Maguire taxi study and its implications for adult plasticity.' },
					{ id: 'M3-Q07', text: 'Detail the endocrine results of Seltzer et al. (2012) across communication modes.' },
					{ id: 'M3-Q16', text: 'Walk through the Google Effect experiments and their memory implications.' },
					{ id: 'M4-Q05', text: 'Differentiate placebo vs nocebo neurochemistry and cite the relevant blockers.' },
					{ id: 'M4-Q07', text: 'Define the motor placebo and the neural structures involved.' },
					{ id: 'M4-Q10', text: 'Interpret the de la Fuente-Fernandez PET findings and Raclopride mechanism.' },
					{ id: 'M4-Q15', text: 'Clarify regression to the mean and why it confounds trial readouts.' },
					{ id: 'M4-Q21', text: 'Outline the open-hidden paradigm and what the delta represents.' },
					{ id: 'M4-Q23', text: 'Apply the ViolEx model to describe what happens when expectations are violated.' }
				]
			}
		]
	}
};