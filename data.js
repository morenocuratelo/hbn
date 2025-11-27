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
				type: 'mixed-content',
				title: 'Placebo Neurochemistry',
				desc: 'Antagonists reveal the molecular mechanisms underpinning placebo responses.',
				wiki: ['M4-Q02', 'M4-Q03', 'M4-Q04', 'M4-Q05'],
				textBlocks: [
					{ title: 'Naloxone', text: 'Opioid antagonist. Blocks expectation-based placebo analgesia (via PAG pathways).' },
					{ title: 'Rimonabant', text: 'CB1 antagonist. Blocks placebo analgesia conditioned by non-opioid drugs (NSAIDs).' },
					{ title: 'Proglumide', text: 'CCK antagonist. Blocks the nocebo effect and can potentiate placebo by reducing anxiety.' }
				],
				chartId: 'chartParkinsonDopamine',
				chartCaption: 'Dopamine release in Parkinson\'s disease: ventral striatum (expectation) vs dorsal striatum (improvement).'
			},
			{
				type: 'tabs-content',
				title: 'Experimental Paradigms',
				wiki: ['M4-Q21', 'M4-Q24', 'M4-Q09'],
				tabs: [
					{ label: 'Open vs Hidden', content: '<p>The Open-Hidden paradigm isolates the psychological component. A drug delivered "covertly" (Hidden) is less effective because expectation is absent. The Open-Hidden delta quantifies the placebo contribution.</p>' },
					{ label: 'Conditioning', content: '<p>Benedetti et al.: Pharmacological conditioning (for example, four pre-test sessions) produces stronger and longer-lasting placebo effects than verbal suggestion alone.</p>' },
					{ label: 'Immunosuppression', content: '<p>Goebel et al. (2002): The immune system can be conditioned. A flavour (CS) paired with Cyclosporine A (US) later reduces IL-2 and IFN-gamma on its own.</p>' }
				]
			},
			{
				type: 'chart-section',
				title: 'Conditioning Effect (Dose-Response)',
				desc: 'Relation between the number of conditioning sessions and muscle rigidity reduction (Parkinsonian model).',
				wiki: ['M4-Q11'],
				chartId: 'chartConditioningDose'
			},
			{
				type: 'grid-cards',
				title: 'Clinical Trial Design',
				wiki: ['M4-Q16', 'M4-Q17', 'M4-Q19', 'M4-Q20'],
				items: [
					{ icon: '🧪', title: 'Phases I–IV', text: 'From safety (I) to efficacy (II–III) and post-marketing surveillance (IV).' },
					{ icon: '🔄', title: 'Cross-over', text: 'Each participant receives both drug and placebo at different times (self-control).' },
					{ icon: '🎭', title: 'Double-Blind', text: 'Neither patient nor experimenter knows the allocation, preventing bias.' },
					{ icon: '📉', title: 'Regression to the Mean', text: 'Natural statistical improvement of extreme symptoms, often mistaken for efficacy.' }
				]
			},
			{
				type: 'chart-section',
				title: 'Placebo and Hormones',
				desc: 'Placebo can mimic hormonal effects (for example, GH and cortisol) after prior conditioning (Benedetti).',
				wiki: ['M4-Q09', 'M4-Q10'],
				chartId: 'chartHormonePlacebo'
			},
			{
				type: 'study-guide',
				title: 'Neurochemistry of Expectation',
				desc: 'Detailed walkthrough of antagonists, PAG pathways, and dopaminergic signatures.',
				ids: ['M4-Q02', 'M4-Q03', 'M4-Q04', 'M4-Q05', 'M4-Q06', 'M4-Q07', 'M4-Q08', 'M4-Q09', 'M4-Q10', 'M4-Q11']
			},
			{
				type: 'study-guide',
				title: 'Clinical Trial Methodology',
				desc: 'From definitions and pharmacology to gold-standard designs, run-ins, cross-over, and open-hidden paradigms.',
				ids: ['M4-Q01', 'M4-Q12', 'M4-Q13', 'M4-Q14', 'M4-Q15', 'M4-Q16', 'M4-Q17', 'M4-Q18', 'M4-Q19', 'M4-Q20', 'M4-Q21']
			},
			{
				type: 'study-guide',
				title: 'Psychological Mechanisms & Bayesian View',
				desc: 'Expectation, prediction errors, and classical conditioning explained for placebo/nocebo.',
				ids: ['M4-Q22', 'M4-Q23', 'M4-Q24']
			}
		]
	},

	review: {
		intro: {
			title: 'General Revision',
			text: 'Use this module to assess your mastery of all covered topics.',
			color: 'rose'
		},
		sections: [
			{
				type: 'text-block',
				title: 'Instructions',
				content: '<p>Use the selectors below to filter questions by topic. Multiple-choice questions cover definitions and study outcomes, whereas Open Prompts encourage extended responses.</p>'
			},
			{
				type: 'question-browser',
				title: 'Multiple-Choice Questions (MCQ)',
				desc: 'Complete repository of exam items with answer keys.'
			},
			{
				type: 'prompt-explorer',
				title: 'Open Questions & Extended Responses',
				desc: 'Explore discursive prompts alongside their detailed answers.'
			}
		]
	}
};