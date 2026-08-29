// this is the main class for the search engine
// as you will see there are some weird things because i
// had claude help me build it, and because sonnet is
// so damn powerful it added an entire demo system
class EnhancedSearchEngine {
    constructor(data) {
        this.data = data; // this loads the entire data structure
        this.documents = data.sentences || []; // this loads the sentences arrays
        this.buildInvertedIndex(); // this builds and inverted index which makes it a LOT faster
        // inverted index makes it so you can find similar data faster without searching everything
        this.computeIdfScores(); // this computes IDF scores (Inverse Document Frequency)
        // IDF scores is the frequency of words, so think of it as more smarter stop word detector

        // this is a premade entity recognition that is good for relations
        // not much else.
        this.entitySignatures = {
            // =========================================================
            // MATHEMATICS
            // =========================================================

            "euler": {
                domains: ["mathematics", "calculus", "number_theory", "physics"],
                entity_type: "mathematician"
            },

            "gauss": {
                domains: ["mathematics", "number_theory", "statistics", "physics"],
                entity_type: "mathematician"
            },

            "newton": {
                domains: ["mathematics", "calculus", "physics", "astronomy"],
                entity_type: "scientist"
            },

            "riemann": {
                domains: ["mathematics", "calculus", "number_theory", "geometry"],
                entity_type: "mathematician"
            },

            "pythagoras": {
                domains: ["mathematics", "geometry", "philosophy"],
                entity_type: "mathematician"
            },

            "fibonacci": {
                domains: ["mathematics", "number_theory", "sequences"],
                entity_type: "mathematician"
            },

            "number": {
                domains: ["mathematics", "arithmetic", "number_theory"],
                entity_type: "concept"
            },

            "integer": {
                domains: ["mathematics", "arithmetic", "number_theory"],
                entity_type: "concept"
            },

            "fraction": {
                domains: ["mathematics", "arithmetic", "algebra"],
                entity_type: "concept"
            },

            "prime": {
                domains: ["mathematics", "number_theory", "arithmetic"],
                entity_type: "concept"
            },

            "theorem": {
                domains: ["mathematics", "logic", "geometry", "physics"],
                entity_type: "concept"
            },

            "proof": {
                domains: ["mathematics", "logic", "computer_science"],
                entity_type: "concept"
            },

            "equation": {
                domains: ["mathematics", "algebra", "calculus", "physics"],
                entity_type: "concept"
            },

            "identity": {
                domains: ["mathematics", "algebra", "logic"],
                entity_type: "concept"
            },

            "function": {
                domains: ["mathematics", "calculus", "algebra", "computer_science"],
                entity_type: "concept"
            },

            "calculus": {
                domains: ["mathematics", "analysis", "physics", "engineering"],
                entity_type: "field"
            },

            "algebra": {
                domains: ["mathematics", "number_theory", "geometry", "logic"],
                entity_type: "field"
            },

            "geometry": {
                domains: ["mathematics", "physics", "architecture", "engineering"],
                entity_type: "field"
            },

            "topology": {
                domains: ["mathematics", "geometry", "physics"],
                entity_type: "field"
            },

            "statistics": {
                domains: ["mathematics", "probability", "data_science", "social_science"],
                entity_type: "field"
            },

            "probability": {
                domains: ["mathematics", "statistics", "physics", "computer_science"],
                entity_type: "field"
            },


            // =========================================================
            // PHYSICS
            // =========================================================

            "physics": {
                domains: ["physics", "mathematics", "engineering", "astronomy"],
                entity_type: "field"
            },

            "energy": {
                domains: ["physics", "chemistry", "engineering"],
                entity_type: "concept"
            },

            "force": {
                domains: ["physics", "mechanics", "engineering"],
                entity_type: "concept"
            },

            "mass": {
                domains: ["physics", "mechanics", "chemistry"],
                entity_type: "concept"
            },

            "momentum": {
                domains: ["physics", "mechanics", "mathematics"],
                entity_type: "concept"
            },

            "gravity": {
                domains: ["physics", "astronomy", "mechanics"],
                entity_type: "phenomenon"
            },

            "relativity": {
                domains: ["physics", "astronomy", "mathematics", "cosmology"],
                entity_type: "theory"
            },

            "quantum": {
                domains: ["physics", "quantum_mechanics", "chemistry", "mathematics"],
                entity_type: "field"
            },

            "atom": {
                domains: ["physics", "chemistry", "quantum_mechanics"],
                entity_type: "concept"
            },

            "electron": {
                domains: ["physics", "chemistry", "electronics", "quantum_mechanics"],
                entity_type: "particle"
            },

            "photon": {
                domains: ["physics", "optics", "quantum_mechanics", "electromagnetism"],
                entity_type: "particle"
            },

            "thermodynamics": {
                domains: ["physics", "chemistry", "engineering", "energy"],
                entity_type: "field"
            },

            "mechanics": {
                domains: ["physics", "engineering", "mathematics"],
                entity_type: "field"
            },

            "electromagnetism": {
                domains: ["physics", "electronics", "engineering", "mathematics"],
                entity_type: "field"
            },


            // =========================================================
            // CHEMISTRY
            // =========================================================

            "chemistry": {
                domains: ["chemistry", "physics", "biology", "materials_science"],
                entity_type: "field"
            },

            "molecule": {
                domains: ["chemistry", "biology", "physics"],
                entity_type: "concept"
            },

            "element": {
                domains: ["chemistry", "physics", "materials_science"],
                entity_type: "concept"
            },

            "reaction": {
                domains: ["chemistry", "biology", "physics"],
                entity_type: "process"
            },

            "acid": {
                domains: ["chemistry", "biology"],
                entity_type: "substance"
            },

            "base": {
                domains: ["chemistry", "mathematics", "computer_science"],
                entity_type: "concept"
            },

            "oxidation": {
                domains: ["chemistry", "biology", "materials_science"],
                entity_type: "process"
            },

            "catalyst": {
                domains: ["chemistry", "biology", "engineering"],
                entity_type: "substance"
            },


            // =========================================================
            // BIOLOGY
            // =========================================================

            "biology": {
                domains: ["biology", "medicine", "chemistry", "ecology"],
                entity_type: "field"
            },

            "cell": {
                domains: ["biology", "medicine", "genetics", "microbiology"],
                entity_type: "concept"
            },

            "dna": {
                domains: ["biology", "genetics", "medicine", "biochemistry"],
                entity_type: "molecule"
            },

            "gene": {
                domains: ["biology", "genetics", "medicine"],
                entity_type: "concept"
            },

            "protein": {
                domains: ["biology", "biochemistry", "medicine"],
                entity_type: "molecule"
            },

            "evolution": {
                domains: ["biology", "genetics", "ecology", "anthropology"],
                entity_type: "process"
            },

            "species": {
                domains: ["biology", "ecology", "evolution", "taxonomy"],
                entity_type: "concept"
            },

            "ecosystem": {
                domains: ["biology", "ecology", "environmental_science"],
                entity_type: "system"
            },


            // =========================================================
            // COMPUTER SCIENCE
            // =========================================================

            "computer": {
                domains: ["computer_science", "technology", "engineering"],
                entity_type: "technology"
            },

            "algorithm": {
                domains: ["computer_science", "mathematics", "logic"],
                entity_type: "concept"
            },

            "programming": {
                domains: ["computer_science", "software_engineering"],
                entity_type: "field"
            },

            "software": {
                domains: ["computer_science", "technology", "programming"],
                entity_type: "technology"
            },

            "hardware": {
                domains: ["computer_science", "engineering", "electronics"],
                entity_type: "technology"
            },

            "database": {
                domains: ["computer_science", "software_engineering", "data_science"],
                entity_type: "technology"
            },

            "network": {
                domains: ["computer_science", "networking", "telecommunications"],
                entity_type: "technology"
            },

            "internet": {
                domains: ["computer_science", "networking", "technology", "communication"],
                entity_type: "technology"
            },

            "artificial_intelligence": {
                domains: ["computer_science", "machine_learning", "mathematics"],
                entity_type: "field"
            },

            "machine_learning": {
                domains: ["computer_science", "artificial_intelligence", "statistics", "mathematics"],
                entity_type: "field"
            },

            "neural_network": {
                domains: ["machine_learning", "artificial_intelligence", "mathematics", "computer_science"],
                entity_type: "technology"
            },

            "python": {
                domains: ["programming", "computer_science", "software_engineering", "data_science"],
                entity_type: "programming_language"
            },

            "javascript": {
                domains: ["programming", "computer_science", "web_development", "software_engineering"],
                entity_type: "programming_language"
            },

            "electron": {
                domains: ["programming", "javascript", "desktop_development", "software"],
                entity_type: "framework"
            },


            // =========================================================
            // POLITICS / GOVERNMENT
            // =========================================================

            "politics": {
                domains: ["politics", "government", "sociology", "history"],
                entity_type: "field"
            },

            "political": {
                domains: ["politics", "government", "sociology"],
                entity_type: "adjective"
            },

            "government": {
                domains: ["politics", "law", "public_administration"],
                entity_type: "institution"
            },

            "democracy": {
                domains: ["politics", "government", "history", "philosophy"],
                entity_type: "system"
            },

            "republic": {
                domains: ["politics", "government", "history"],
                entity_type: "system"
            },

            "monarchy": {
                domains: ["politics", "government", "history"],
                entity_type: "system"
            },

            "constitution": {
                domains: ["politics", "law", "government", "history"],
                entity_type: "document"
            },

            "parliament": {
                domains: ["politics", "government", "law"],
                entity_type: "institution"
            },

            "president": {
                domains: ["politics", "government", "leadership"],
                entity_type: "politician"
            },

            "election": {
                domains: ["politics", "government", "sociology"],
                entity_type: "event"
            },

            "nationalism": {
                domains: ["politics", "sociology", "history", "ideology"],
                entity_type: "ideology"
            },

            "liberalism": {
                domains: ["politics", "philosophy", "economics", "ideology"],
                entity_type: "ideology"
            },

            "socialism": {
                domains: ["politics", "economics", "history", "ideology"],
                entity_type: "ideology"
            },

            "capitalism": {
                domains: ["economics", "politics", "history", "ideology"],
                entity_type: "economic_system"
            },


            // =========================================================
            // HISTORY
            // =========================================================

            "history": {
                domains: ["history", "politics", "sociology", "culture"],
                entity_type: "field"
            },

            "war": {
                domains: ["history", "politics", "military", "geopolitics"],
                entity_type: "event"
            },

            "empire": {
                domains: ["history", "politics", "geopolitics", "culture"],
                entity_type: "political_entity"
            },

            "revolution": {
                domains: ["history", "politics", "sociology", "economics"],
                entity_type: "event"
            },

            "colonialism": {
                domains: ["history", "politics", "geopolitics", "sociology"],
                entity_type: "ideology"
            },

            "industrialization": {
                domains: ["history", "economics", "technology", "sociology"],
                entity_type: "process"
            },


            // =========================================================
            // ECONOMICS
            // =========================================================

            "economics": {
                domains: ["economics", "mathematics", "statistics", "politics"],
                entity_type: "field"
            },

            "inflation": {
                domains: ["economics", "finance", "politics"],
                entity_type: "economic_concept"
            },

            "recession": {
                domains: ["economics", "finance", "politics"],
                entity_type: "economic_event"
            },

            "market": {
                domains: ["economics", "finance", "business"],
                entity_type: "concept"
            },

            "stock": {
                domains: ["finance", "economics", "business"],
                entity_type: "financial_asset"
            },

            "bank": {
                domains: ["finance", "economics", "business"],
                entity_type: "institution"
            },

            "currency": {
                domains: ["economics", "finance", "politics", "history"],
                entity_type: "financial_concept"
            },


            // =========================================================
            // PHILOSOPHY / LOGIC
            // =========================================================

            "philosophy": {
                domains: ["philosophy", "logic", "history", "sociology"],
                entity_type: "field"
            },

            "logic": {
                domains: ["logic", "mathematics", "philosophy", "computer_science"],
                entity_type: "field"
            },

            "ethics": {
                domains: ["philosophy", "law", "sociology", "politics"],
                entity_type: "field"
            },

            "epistemology": {
                domains: ["philosophy", "logic", "science"],
                entity_type: "field"
            },

            "metaphysics": {
                domains: ["philosophy", "logic"],
                entity_type: "field"
            },

            "existentialism": {
                domains: ["philosophy", "literature", "psychology"],
                entity_type: "ideology"
            },


            // =========================================================
            // ENGINEERING
            // =========================================================

            "engineering": {
                domains: ["engineering", "physics", "mathematics", "technology"],
                entity_type: "field"
            },

            "mechanical": {
                domains: ["engineering", "mechanics", "physics"],
                entity_type: "field"
            },

            "electrical": {
                domains: ["engineering", "electronics", "physics"],
                entity_type: "field"
            },

            "circuit": {
                domains: ["electronics", "electrical_engineering", "physics"],
                entity_type: "technology"
            },

            "robot": {
                domains: ["robotics", "engineering", "computer_science", "artificial_intelligence"],
                entity_type: "machine"
            },

            "robotics": {
                domains: ["engineering", "computer_science", "artificial_intelligence"],
                entity_type: "field"
            },


            // =========================================================
            // CULTURE / SOCIOLOGY
            // =========================================================

            "society": {
                domains: ["sociology", "politics", "history", "culture"],
                entity_type: "concept"
            },

            "sociology": {
                domains: ["sociology", "politics", "history", "psychology"],
                entity_type: "field"
            },

            "culture": {
                domains: ["culture", "sociology", "history", "anthropology"],
                entity_type: "concept"
            },

            "religion": {
                domains: ["religion", "history", "sociology", "philosophy"],
                entity_type: "social_system"
            },

            "language": {
                domains: ["linguistics", "culture", "computer_science", "communication"],
                entity_type: "concept"
            },

            "linguistics": {
                domains: ["linguistics", "language", "psychology", "computer_science"],
                entity_type: "field"
            },


            // =========================================================
            // GEOGRAPHY
            // =========================================================

            "geography": {
                domains: ["geography", "history", "politics", "environmental_science"],
                entity_type: "field"
            },

            "country": {
                domains: ["geography", "politics", "government", "history"],
                entity_type: "place"
            },

            "city": {
                domains: ["geography", "urban_planning", "sociology"],
                entity_type: "place"
            },

            "continent": {
                domains: ["geography", "geology", "history"],
                entity_type: "place"
            },

            "ocean": {
                domains: ["geography", "oceanography", "climate_science"],
                entity_type: "place"
            },


            // =========================================================
            // ASTRONOMY / SPACE
            // =========================================================

            "astronomy": {
                domains: ["astronomy", "physics", "mathematics", "cosmology"],
                entity_type: "field"
            },

            "planet": {
                domains: ["astronomy", "physics", "geology"],
                entity_type: "celestial_body"
            },

            "star": {
                domains: ["astronomy", "astrophysics", "physics"],
                entity_type: "celestial_body"
            },

            "galaxy": {
                domains: ["astronomy", "astrophysics", "cosmology"],
                entity_type: "celestial_structure"
            },

            "black_hole": {
                domains: ["astronomy", "astrophysics", "relativity", "physics"],
                entity_type: "celestial_object"
            },

            "universe": {
                domains: ["cosmology", "astronomy", "physics", "philosophy"],
                entity_type: "concept"
            },


            // =========================================================
            // MEDICINE
            // =========================================================

            "medicine": {
                domains: ["medicine", "biology", "chemistry", "health_science"],
                entity_type: "field"
            },

            "disease": {
                domains: ["medicine", "biology", "pathology"],
                entity_type: "condition"
            },

            "virus": {
                domains: ["biology", "medicine", "microbiology"],
                entity_type: "pathogen"
            },

            "bacteria": {
                domains: ["biology", "medicine", "microbiology"],
                entity_type: "organism"
            },

            "brain": {
                domains: ["biology", "medicine", "neuroscience", "psychology"],
                entity_type: "organ"
            },

            "neuron": {
                domains: ["biology", "neuroscience", "medicine"],
                entity_type: "cell"
            },


            // =========================================================
            // GENERAL TECHNOLOGY
            // =========================================================

            "technology": {
                domains: ["technology", "engineering", "computer_science"],
                entity_type: "concept"
            },

            "internet": {
                domains: ["technology", "computer_science", "networking"],
                entity_type: "technology"
            },

            "server": {
                domains: ["computer_science", "networking", "technology"],
                entity_type: "computer"
            },

            "database": {
                domains: ["computer_science", "data_science", "software_engineering"],
                entity_type: "technology"
            }
        };


        // =============================================================
        // DOMAIN COMPATIBILITY
        // =============================================================

        this.domainCompatibility = {

            // Mathematics
            "mathematics,calculus": 0.95,
            "mathematics,algebra": 0.92,
            "mathematics,geometry": 0.90,
            "mathematics,number_theory": 0.95,
            "mathematics,statistics": 0.88,
            "mathematics,probability": 0.90,
            "mathematics,logic": 0.85,
            "mathematics,physics": 0.88,
            "mathematics,engineering": 0.82,
            "mathematics,computer_science": 0.78,

            // Calculus
            "calculus,analysis": 0.98,
            "calculus,physics": 0.94,
            "calculus,engineering": 0.90,
            "calculus,mechanics": 0.88,
            "calculus,astronomy": 0.82,

            // Physics
            "physics,mechanics": 0.96,
            "physics,electromagnetism": 0.96,
            "physics,thermodynamics": 0.94,
            "physics,quantum_mechanics": 0.98,
            "physics,astronomy": 0.95,
            "physics,chemistry": 0.82,
            "physics,engineering": 0.92,
            "physics,mathematics": 0.88,

            // Chemistry
            "chemistry,biology": 0.88,
            "chemistry,biochemistry": 0.97,
            "chemistry,physics": 0.82,
            "chemistry,materials_science": 0.90,
            "chemistry,medicine": 0.78,

            // Biology
            "biology,genetics": 0.98,
            "biology,medicine": 0.92,
            "biology,ecology": 0.95,
            "biology,microbiology": 0.98,
            "biology,chemistry": 0.88,
            "biology,neuroscience": 0.90,

            // Computer science
            "computer_science,programming": 0.98,
            "computer_science,software_engineering": 0.97,
            "computer_science,artificial_intelligence": 0.96,
            "computer_science,machine_learning": 0.95,
            "computer_science,mathematics": 0.78,
            "computer_science,logic": 0.88,
            "computer_science,networking": 0.90,

            // AI
            "artificial_intelligence,machine_learning": 0.99,
            "artificial_intelligence,neural_networks": 0.98,
            "artificial_intelligence,mathematics": 0.82,
            "machine_learning,statistics": 0.94,
            "machine_learning,probability": 0.88,
            "machine_learning,data_science": 0.96,

            // Politics
            "politics,government": 0.98,
            "politics,sociology": 0.88,
            "politics,history": 0.90,
            "politics,law": 0.94,
            "politics,economics": 0.82,
            "politics,geopolitics": 0.96,
            "politics,philosophy": 0.72,

            // Sociology
            "sociology,history": 0.88,
            "sociology,psychology": 0.86,
            "sociology,anthropology": 0.94,
            "sociology,culture": 0.97,
            "sociology,politics": 0.88,

            // History
            "history,politics": 0.90,
            "history,war": 0.96,
            "history,geopolitics": 0.90,
            "history,economics": 0.78,
            "history,culture": 0.90,
            "history,religion": 0.82,

            // Economics
            "economics,finance": 0.97,
            "economics,business": 0.92,
            "economics,politics": 0.82,
            "economics,statistics": 0.90,
            "economics,mathematics": 0.82,

            // Philosophy
            "philosophy,logic": 0.94,
            "philosophy,ethics": 0.97,
            "philosophy,history": 0.80,
            "philosophy,politics": 0.72,
            "philosophy,psychology": 0.72,

            // Engineering
            "engineering,physics": 0.92,
            "engineering,mathematics": 0.82,
            "engineering,electronics": 0.96,
            "engineering,robotics": 0.94,
            "engineering,computer_science": 0.75,

            // Astronomy
            "astronomy,astrophysics": 0.99,
            "astronomy,cosmology": 0.98,
            "astronomy,physics": 0.95,
            "astronomy,mathematics": 0.82,
            "astronomy,geology": 0.65,

            // Medicine
            "medicine,biology": 0.92,
            "medicine,chemistry": 0.78,
            "medicine,neuroscience": 0.94,
            "medicine,pathology": 0.96,
            "medicine,genetics": 0.88,

            // Technology
            "technology,engineering": 0.90,
            "technology,computer_science": 0.92,
            "technology,programming": 0.88,
            "technology,electronics": 0.90,

            // Basically unrelated
            "mathematics,politics": 0.10,
            "calculus,nationalism": 0.05,
            "physics,nationalism": 0.08,
            "chemistry,politics": 0.12,
            "geometry,nationalism": 0.05,
            "biology,politics": 0.20
        };
        // this is to figure out if the user is asking a question type sentence
        // particularily good for knowing if your just saying hi, not asking what a neural network is
        this.questionRegex = /^(?:(?:can|could|would)\s+(?:you\s+)?(?:tell|show|find|give)\s+(?:me\s+)?|please\s+(?:show|find|tell)\s+(?:me\s+)?|(?:what|who|where|when|why|how|which))(?:\s+(?:is|are|was|were|do|does|did|can|could|should|would|to|about|in|on))?(?:\s+(?:the|a|an|my|your|our|some))?\b/i;
    }

    // this builds the inverted index
    buildInvertedIndex() {
        this.invertedIndex = {}; // initialize an empty object for the inverted index
        for (let docId = 0; docId < this.documents.length; docId++) { // load and loop through every document/sentence
            const doc = this.documents[docId]; // if document id is 2, then document[2] is used
            const tokens = this.tokenize(doc.text || ""); // this tokenizes the text into seperate words
            const uniqueTokens = new Set(tokens); // remove duplicate words, since it is unnesesary (usually)

            for (const token of uniqueTokens) {
                if (!this.invertedIndex[token]) { // check if the token doesnt exist
                    this.invertedIndex[token] = new Set(); // create a new set for the word if its token doesnt exist
                } // this is particularily good for finding related documents much faster instead of streaming everything
                this.invertedIndex[token].add(docId); // this adds the document ID to the token
            }
        }
    }
    // this is to compute the IDF scores
    computeIdfScores() {
        const numDocs = this.documents.length; // this counts the number of documents
        this.idfScores = {}; // initialize an empty idf score table
        
        // loop through every word and use the logic inside
        for (const [token, docIds] of Object.entries(this.invertedIndex)) { // loop until finished
            const df = docIds.size; // calculates document frequency
            // this tells the AI how many documents it finds that word in
            this.idfScores[token] = Math.log(numDocs / (1 + df)); // this calculates the actual frequency
        }   // this makes it so words that appear less = more important, and words that appear more = less important
    }

    // this is the clean the user query of any weird regex or symbols and makes it keyword only
    cleanQuery(query) {
        let cleaned = query.trim(); // this removes whitespace
        while (true) { // this part loops until finished
            const newCleaned = this.questionRegex.exec(cleaned) // this finds question regex like "what is", "who is"
                ? cleaned.replace(this.questionRegex, "").trim() // this removes the question regex
                : cleaned; 
            if (newCleaned === cleaned) break; // this makes sure it keep looping until it doesnt find anything else
            cleaned = newCleaned; // cleaned and newClean must be identical for it to stop looping
        } // this is useful for removing the question style stuff that is mostly bloat
        return cleaned || query.trim(); // this returns the cleaned query
    }

    // this tokenizes the text into seperate word sets
    tokenize(text) {
        const matches = text.match(/\b[a-zA-Z0-9]+\b/g) || []; // this searches the entire string
        return matches.map(m => m.toLowerCase()); // this converts everything to lowercase
    } // this is probably the most important part, it tokenizes your user input

    extractEntities(text) {
        const tokens = this.tokenize(text); // this tokenizes the extracted text
        const entities = {}; // initialize empty entities array

        for (const token of tokens) { // this checks every token
            if (token in this.entitySignatures) { // this checks your entity signatures (read above)
                entities[token] = this.entitySignatures[token].domains; // store the founded relations
            }
        }
        // return the entities, like usual
        return entities;
    }

    // this figures out if the things the user says belong together
    computeDomainCoherence(entities) {
        const entityDomains = Object.values(entities); // this extracts the entities and removes them from the domains
        
        // this makes it so if only 1 entity domain exists, then it is perfectly coherent
        // this is obvious since if you ask "what is a cat", then it knows "cat" is the only one,
        // so the user is talking about a cat.
        if (entityDomains.length <= 1) return 1.0; // 1 = 100%

        let coherenceScore = 0.0; // init coherency score
        let comparisons = 0; // init comparison score

        // this is to compare every pair of entities,
        // since you dont want the same pair in reverse,
        // hence why "j = i + 1"
        for (let i = 0; i < entityDomains.length; i++) {
            for (let j = i + 1; j < entityDomains.length; j++) {
                const domainsI = new Set(entityDomains[i]); // this converts the domain i into a set
                const domainsJ = new Set(entityDomains[j]); // this also converts the domain j into a set

                // this is to compare every domain against every other domain
                for (const dI of domainsI) {
                    for (const dJ of domainsJ) {
                        const pair = [dI, dJ].sort().join(","); // create a domain pair to avoid "vise versa"
                        const compatibility = this.domainCompatibility[pair] ?? 0.5; // this is for compatibility
                        // if the 2 or more domains are in a pair in the above domains, then use their score.
                        // if there is no domain pairs found, then return with 0.5 since we cannot assume anything.
                        coherenceScore += compatibility; // add the compatibility values together
                        comparisons++; // add the comparisons up
                    }
                }
            }
        }
        // calculate the average value
        if (comparisons === 0) return 1.0; // this is for if there are no comparisons, then return null
        return coherenceScore / comparisons; // this calculates the average using a / b formula
    }

    // this is the main scoring for the search
    // this is to figure out how relevant a document is to the users query
    scoreDocumentEnhanced(query, doc) {

        // this is especially useful for debugging,
        // because it will show you why you got the documents
        // amazing for testers
        const debugInfo = {
            keyword_score: 0.0, 
            tf_idf_score: 0.0,
            coherence_score: 0.0,
            phrase_match_score: 0.0,
            final_score: 0.0,
        };
        
        // these are constants
        let score = 0.0;
        const cleanedQuery = this.cleanQuery(query);              // these are for cleaning user query from
        const queryTokens = this.tokenize(cleanedQuery);          // "what is albert einstein" to "albert einstein"
        const queryEntities = this.extractEntities(cleanedQuery); // to "albert" "einstein"; good for RAG

        // these prepare the document(s) to be used
        const docText = (doc.text || "").toLowerCase(); // this is the document text/sentence
        const docTokens = this.tokenize(docText); // this is the tokens/individual words
        const docEntities = this.extractEntities(docText); // entities/known concepts/people/etc
        const docKeywords = (doc.keywords || []).map(k => k.toLowerCase()); // this is existing keywords
        const docTopic = String(doc.topic_genre || "").toLowerCase(); // this is the sentence topic

        // this is keyword matching, for TF-IDF
        for (const token of queryTokens) { // this checks if the search term occurs in the sentence
            if (docKeywords.includes(token)) { // if the keyword(s) match keywords in sentence
                const tf = docTokens.filter(t => t === token).length + 1; // calculate term frequency
                const idf = this.idfScores[token] ?? 1.0; // this gets the words IDF
                const contribution = tf * idf * 5; // this gives keyword matches 5x multiplier
                // this is to makes these matching ones stand out more
                debugInfo.tf_idf_score += contribution; // adds them together
                score += contribution; // final addition
            } else if (docTokens.includes(token)) { // if it isnt a keyword match
                const tf = docTokens.filter(t => t === token).length; // you still get some
                const idf = this.idfScores[token] ?? 1.0; // same as above, still some
                const contribution = tf * idf; // this does the same, but no 5x multiplier
                // this is because these are less useful, so it doesnt give it 5x
                debugInfo.tf_idf_score += contribution; // adds them together
                score += contribution; // final addition
            }
        }

        // this is for if the phrase is an EXACT match in the sentence
        if (docText.includes(cleanedQuery.toLowerCase()) && cleanedQuery.trim().length > 3) {
            debugInfo.phrase_match_score += 50; // this adds 50
            score += 50; // this adds 50
            // we add 50 because an exact match means the document is even more likely to
            // contain the information the user may need
        }

        // this asks whether the domains and entities makes sense together
        const combinedEntities = { ...queryEntities, ...docEntities }; // this combines them
        const coherence = this.computeDomainCoherence(combinedEntities); // this figures out the coherency
        debugInfo.coherence_score = coherence; // final result

        // this is to calculate whether they match
        if (coherence < 0.3) { // if coherency is below 30%
            score *= 0.1; // very low score (90% penalty)
        } else if (coherence < 0.5) { // if coherency is below 50%
            score *= 0.5; // give a penalty of 50%
        } else { // if the score is not one of the above (meaning higher)
            score *= (0.8 + 0.2 * coherence); // give no penalty (0.2 + 0.8 = 1.0)
        }

        // this checks if there is topic matching, and if so, add a bonus
        if (docTopic && docTopic !== "none" && docTopic !== "null" && docTopic !== "") {
            // if the document contains a topic
            for (const token of queryTokens) {
                if (docTopic.includes(token)) { // if the topic is a match with the query
                    score += 8; // add +8 to the score
                }
            }
        }

        // this is to find out if there are any dates associated with the sentence
        const dates = doc.dates_times || [];
        if (dates && dates.length > 0) { // if it detects a date inside the dates
            for (const date of dates) {
                if (query.toLowerCase().includes(String(date).toLowerCase())) { // matching query to dates
                    // if the user query contains a valid date, and it has a match with a document
                    score += 10; // add +10 to the score
                }
            }
        }
        // this returns the final score of the sentence
        debugInfo.final_score = score; // this is returns both final score and debug score
        return [Math.max(0, score), debugInfo]; // this ensures the score can never be a negative
    }

    // calculating simularity using jaccard similarity
    calculateSemanticSimilarity(entitySetA, entitySetB) {
        // make sure both sides have entities, if not then return 0/null
        if (!Object.keys(entitySetA).length || !Object.keys(entitySetB).length) {
            return 0.0; // 0.0 = nothing
        }
        
        const domainsA = new Set(); // this is for domain A
        const domainsB = new Set(); // this is for domain B

        // collect the domains from A
        for (const domains of Object.values(entitySetA)) { 
            for (const domain of domains) { // because we use Set, duplicates will dissapear
                domainsA.add(domain); // add remaining to domain A
            }
        }

        // same as above, but for B
        for (const domains of Object.values(entitySetB)) {
            for (const domain of domains) { // because we use Set, duplicates with dissapear
                domainsB.add(domain); // ads remaining to domain B
            }
        }

        // if either domain size is null, then return 0.0
        if (!domainsA.size || !domainsB.size) return 0.0;
        // find the intersection/what both sides have in common
        const intersection = new Set([...domainsA].filter(x => domainsB.has(x)));
        const union = new Set([...domainsA, ...domainsB]); // union is everything appearing in either set

        // calculate the similarity using intersection / union
        return union.size > 0 ? intersection.size / union.size : 0.0;
    }

    // this takes all the other components above and puts it together    
    // these are the function perameters, think of it as the defaults

    // query is what the user searched for
    // topKCandidates are how many promising documents before expensive analysis
    // limit is how many results you ultimatly return
    // coherenceThreshold is the minimum cutoff (however isnt used currently)
    // debug = false is just to remove the debug information from entering results
    search(query, topKCandidates = 50, limit = 5, coherenceThreshold = 0.2, debug = false) {
        const candidates = []; // init canditates
        // this extracts the query entities
        const queryEntities = this.extractEntities(this.cleanQuery(query));

        // score/loop through every document
        for (let docIdx = 0; docIdx < this.documents.length; docIdx++) {
            const doc = this.documents[docIdx]; // this gets the document
            // this calls the huge scoring system above for each
            const [score, debugInfo] = this.scoreDocumentEnhanced(query, doc); 

            // this ingores 0 return documents (documents with 0 or less score)
            if (score > 0) {
                // this extracts the document entities/domains
                const docEntities = this.extractEntities(doc.text || "");
                // this uses the big calculator code above to calculate similarity
                const semSim = this.calculateSemanticSimilarity(queryEntities, docEntities);

                // this stores the metadata of each candidate for ranking
                candidates.push({
                    doc, // sentence
                    score, // score
                    semantic_similarity: semSim, // similarity
                    debug: debugInfo, // debug info
                    doc_idx: docIdx, // doc id
                });
            }
        }

        // if no results or nothing matches, return null
        if (!candidates.length) return [];

        // Sort by score
        candidates.sort((a, b) => b.score - a.score); // this sorts from highest to lowest scores
        let topCandidates = candidates.slice(0, topKCandidates); // this keeps only the top candidates
        // this will remove the majority of useless information to the users query

        // here we compare every remaining candidate by every other candidate
        for (let i = 0; i < topCandidates.length; i++) {
            for (let j = i + 1; j < topCandidates.length; j++) {
                // comparing pairs of candidates (useful for pairwise)
                const sim = this.calculateSemanticSimilarity(
                    this.extractEntities(topCandidates[i].doc.text || ""), // first doc
                    this.extractEntities(topCandidates[j].doc.text || "") // second doc
                );
                // this is if the similarity is higher than 30%
                if (sim > 0.3) {

                    // we calculate the multiplier using this formula
                    // 1 + (similarity score * 0.1)
                    topCandidates[i].score *= (1 + sim * 0.1); 
                    topCandidates[j].score *= (1 + sim * 0.1);

                    // the main idea is if 2 sentences are talking about the same thing,
                    // boost their score more to give higher confidence.
                }
            }
        }

        // because the graph voting changed scores, we need to re-rank everything
        // to ensure we still have the best of the best
        topCandidates.sort((a, b) => b.score - a.score); // this sorts top candidates

        // Format results
        const results = [];
        for (const cand of topCandidates.slice(0, limit)) { // take the final results
            // because we set limit = 5 above, this means we will be left with the top 5 candidates
            const doc = cand.doc;
            const result = { // this formats the results and cleans up the numbers
                // so that the front end gets nice clean results rather than
                // calculator soup
                score: Math.round(cand.score * 100) / 100,
                id: doc.id,
                text: doc.text,
                topic: doc.topic_genre,
                semantic_similarity: Math.round(cand.semantic_similarity * 1000) / 1000,
            };

            // this is for debug mode, if you want to see better details
            // if the dev chooses debug = false, then you get the cleaned version
            // if the dev chooses debug = true, then you also get:
            //
            //  debug: {
            //      keyword_score: ...,
            //      tf_idf_score: ...,
            //      coherence_score: ...,
            //      phrase_match_score: ...,
            //      final_score: ...
            //  }
   
            if (debug) {
                result.debug = {};
                for (const [k, v] of Object.entries(cand.debug)) {
                    result.debug[k] = typeof v === 'number' ? Math.round(v * 100) / 100 : v;
                }
            }

            results.push(result);
        }

        // this returns the final results and sends it to the ChatBot
        // to render it into cards and add some final tweaks
        return results;
    }
}
