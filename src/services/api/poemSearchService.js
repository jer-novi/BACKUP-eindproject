/**
 * poemSearchService.js
 * Geavanceerde zoekfuncties (filters, multi-search, combinaties van velden)
 * Complexere zoekopbouw en combinaties, eventueel op basis van een enkele dataset (nog géén cache/cross-data).
 *
 * @description Advanced search functions (filters, multi-search, field combinations)
 * Complex search construction and combinations, potentially based on a single dataset (not yet cache/cross-data).
 *
 * OPTIMIZATIONS IMPLEMENTED:
 * 1. Smart Request Routing - Only makes necessary API calls based on search term analysis
 * 2. Request Deduplication - Prevents duplicate concurrent requests
 * 3. Confidence-based Search Strategy - High confidence patterns skip redundant searches
 * 4. Known Author Detection - Skips title searches for exact author matches
 * 5. Individual API Call Caching - Caches results at the API endpoint level
 *
 * @module poemSearchService
 */

// src/services/api/poemSearchService.js
import {
    searchPoemsByTitle as searchByTitleInService,
    searchPoemsByAuthor as searchByAuthorInService,
    fetchPoemsFromPoetryDBByAuthorAndTitle

} from './poemService.js';
import {poetrydbAuthors} from '@/constants/poetryDbAuthors_2025-05-16.js'; // Zorg ervoor dat je deze lijst hebt gedefinieerd in een apart bestand

// Request deduplication cache
const pendingRequests = new Map();


/**
 * Analyseert een zoekterm en probeert deze intelligent op te splitsen in auteur en titel.
 * Herkent verschillende patronen in de zoekterm.
 *
 * @param {string} searchTerm De complete zoekterm ingevoerd door de gebruiker
 * @returns {Object} Een object met authorTerm, titleTerm, matchType, en confidence
 */
function analyzeSearchTerm(searchTerm) {
    // Log the original search term for debugging
    console.log("Search term analysis:", searchTerm);

    // 1. Check for explicit patterns "author - title" or "title by author"
    const dashPattern = /(.+?)\s+-\s+(.+)/i;
    const byPattern = /(.+?)\s+(?:door|by|van)\s+(.+)/i;

    if (dashPattern.test(searchTerm)) {
        const [_, part1, part2] = searchTerm.match(dashPattern);
        console.log(`Recognized as 'author - title' pattern: author="${part1}", title="${part2}"`);
        return {
            authorTerm: part1.trim(),
            titleTerm: part2.trim(),
            matchType: 'pattern_dash',
            confidence: 'high',
            searchStrategy: 'combined'
        };
    }

    if (byPattern.test(searchTerm)) {
        const [_, part1, part2] = searchTerm.match(byPattern);
        console.log(`Recognized as 'title by/door/van author' pattern: title="${part1}", author="${part2}"`);
        return {
            authorTerm: part2.trim(),
            titleTerm: part1.trim(),
            matchType: 'pattern_by'
        };
    }

    // 2. Word count analysis
    const words = searchTerm.split(/\s+/);
    const numWords = words.length;

    // For 3+ words, assume pattern "First Last Title"
    if (words.length >= 3) {
        // In a production version this would be a much more extensive list or an API
        // Ensure poetrydbAuthors is available in this scope
        const knownAuthorsLower = poetrydbAuthors.map(a => a.toLowerCase());

        // Enhanced author detection for queries with 1 or more words
        if (numWords >= 1) {
            // Check for a known author at the BEGINNING of the search term
            // Tries to match 1, 2, or up to 3 words (configurable) as an author name
            for (let i = Math.min(numWords, 3); i >= 1; i--) {
                const potentialAuthor = words.slice(0, i).join(" ");
                if (knownAuthorsLower.includes(potentialAuthor.toLowerCase())) {
                    const titlePart = words.slice(i).join(" ");
                    // If titlePart is empty, the entire search term is an author's name
                    console.log(`Known author (prefix/full): author="${potentialAuthor}", title="${titlePart}"`);
                    return {
                        authorTerm: potentialAuthor,
                        titleTerm: titlePart, // Can be empty if the full term is an author
                        matchType: titlePart ? `known_author_prefix_${i}_words` : `known_author_exact_${i}_words`,
                        confidence: 'high',
                        searchStrategy: titlePart ? 'combined' : 'author_only'
                    };
                }
            }

            // Default: first two words = author, rest = title
            const potentialAuthor = words.slice(0, 2).join(" ");
            const potentialTitle = words.slice(2).join(" ");
            console.log(`Analysis 3+ words: author="${potentialAuthor}", title="${potentialTitle}"`);
            return {
                authorTerm: potentialAuthor,
                titleTerm: potentialTitle,
                matchType: 'default_3plus',
                confidence: 'medium',
                searchStrategy: 'all'
            };
        }

        // 3. For two words
        if (words.length === 2) {
            const word1Lower = words[0].toLowerCase(); // Define word1Lower
            const word2Lower = words[1].toLowerCase(); // Define word2Lower
            // There are multiple possibilities:
            // a) "Shakespeare Winter" = Author "Shakespeare" and title contains "Winter"
            // b) "Winter Shakespeare" = Title contains "Winter" and author "Shakespeare"
            // c) "Winter Magic" = A title "Winter Magic" by an unknown author
            // d) "William Shakespeare" = An author, no title

            // 3a. Check if one of the words is a known author name
            const knownAuthors = poetrydbAuthors.map(a => a.toLowerCase());
            if (knownAuthors.includes(word1Lower)) {
                console.log(`Word 1 is a known author, searching for: author="${words[0]}", title="${words[1]}"`);
                return {
                    authorTerm: words[0],
                    titleTerm: words[1],
                    matchType: 'word1_known_author',
                    confidence: 'high',
                    searchStrategy: 'combined'
                };
            }
        }

        // Check for a known author at the END of the search term
        // This is only relevant if numWords > 1 and no prefix match was found.
        // Ensures there's at least one word remaining for the title.
        if (numWords > 1) {
            for (let i = Math.min(numWords - 1, 3); i >= 1; i--) {
                // i = number of words from the end to check for author
                // numWords - i = number of words from the start for title
                if ((numWords - i) < 1) continue; // Not enough words for a title

                const potentialAuthor = words.slice(numWords - i).join(" ");
                if (knownAuthorsLower.includes(potentialAuthor.toLowerCase())) {
                    const titlePart = words.slice(0, numWords - i).join(" ");
                    console.log(`Known author (suffix): author="${potentialAuthor}", title="${titlePart}"`);
                    return {
                        authorTerm: potentialAuthor,
                        titleTerm: titlePart,
                        matchType: `known_author_suffix_${i}_words`,
                        confidence: 'high',
                        searchStrategy: 'combined'
                    };
                }
            }
        }
    }


// Fallback logic if no specific author was identified by the enhanced checks above

    // Fallback for 3+ words (if not caught by enhanced author check)
    if (numWords >= 3) {
        const author = words.slice(0, 2).join(" "); // Default: first two words = author
        const title = words.slice(2).join(" ");     // rest = title
        console.log(`Fallback 3+ words (default split): author="${author}", title="${title}"`);
        return {
            authorTerm: author,
            titleTerm: title,
            matchType: 'default_3plus_fallback',
            confidence: 'low',
            searchStrategy: 'all'
        };
    }

    // Fallback for 2 words (if not caught by enhanced author check)
    if (numWords === 2) {
        // If the enhanced checks didn't identify a specific author for a 2-word query,
        // it's considered ambiguous.
        console.log("Fallback 2-words (ambiguous): No specific known author, trying both combinations.");
        return {
            authorTerm: searchTerm, // Original term for broad title/author searches
            titleTerm: searchTerm,
            tryBoth: true,
            option1: {authorTerm: words[0], titleTerm: words[1]},
            option2: {authorTerm: words[1], titleTerm: words[0]},
            matchType: 'two_words_ambiguous_fallback',
            confidence: 'low',
            searchStrategy: 'all'
        };
    }

    // Fallback for 1 word (if not an exact author match from enhanced check) or empty search
    console.log("Fallback (unsplit): Treating entire term for both author and title search, or single word.");
    return {
        authorTerm: searchTerm,
        titleTerm: searchTerm,
        matchType: 'fallback_unsplit',
        confidence: 'low',
        searchStrategy: 'all'
    };
}


/**
 * Helper function to deduplicate requests
 * @param {string} key - Unique key for the request
 * @param {Function} requestFn - Function that returns a promise
 * @returns {Promise} The deduped promise
 */

// TODO Nog implementeren

// TEMP

/**
 * Helper function to deduplicate requests
 * @param {string} key - Unique key for the request
 * @param {Function} requestFn - Function that returns a promise
 * @returns {Promise} The deduped promise
 */
async function dedupeRequest(key, requestFn) {
    // Check if request is already pending
    if (pendingRequests.has(key)) {
        console.log(`Request already pending for: ${key}, returning existing promise`);
        return pendingRequests.get(key);
    }

    // Create new request promise
    const promise = requestFn()
        .finally(() => {
            // Clean up after request completes
            pendingRequests.delete(key);
        });

    // Store in pending requests
    pendingRequests.set(key, promise);
    return promise;
}


/**
 * Voert een algemene zoekopdracht uit op gedichten.
 * Probeert de zoekterm intelligent te matchen tegen zowel titels als auteurs.
 *
 * @description Performs a general search on poems.
 * Tries to intelligently match the search term against both titles and authors.
 *
 * @param {string} searchTerm De ingevoerde zoekterm. / The entered search term.
 * @param {Object} filters Optionele filters voor de zoekopdracht (taal, periode, enz.) / Optional filters for the search (language, period, etc.)
 * @returns {Promise<Array<object>>} Een array van gevonden gedichten. / An array of found poems.
 */
export async function searchPoemsGeneral(searchTerm, filters = {}) {
    console.log("===== New search query =====");
    console.log(`Searching for: "${searchTerm}" with filters:`, filters);

    if (!searchTerm || !searchTerm.trim()) {
        console.log("Empty search query, returning no results");
        return [];
    }

    // 1. Analysis of the search term
    const analysis = analyzeSearchTerm(searchTerm.trim());
    console.log(`Analysis result - confidence: ${analysis.confidence}, strategy: ${analysis.searchStrategy}`);

    // Preparing the promises
    const promises = [];
    const promiseLabels = []; // For logging
    let resultsByTitle = [];
    let resultsByAuthor = [];
    let resultsByAuthorAndTitle = [];
    let resultsByOption1 = [];
    let resultsByOption2 = [];

    // 2. Smart request routing based on analysis
    const shouldSearchTitle = analysis.searchStrategy === 'all' ||
        analysis.searchStrategy === 'title_only' ||
        (analysis.searchStrategy === 'combined' && analysis.confidence !== 'high');

    const shouldSearchAuthor = analysis.searchStrategy === 'all' ||
        analysis.searchStrategy === 'author_only' ||
        (analysis.searchStrategy === 'combined' && analysis.confidence !== 'high');

    // 2a. Search by title (only if needed)
    if (shouldSearchTitle) {
        const titleKey = `title:${searchTerm.toLowerCase()}`;
        promises.push(
            dedupeRequest(titleKey, () =>
                searchByTitleInService(searchTerm).catch(error => {
                    console.error(`Error searching by title with term "${searchTerm}" in service:`, error);
                    return []; // Return empty array on error
                })
            )
        );
        promiseLabels.push("Title search");
    } else {
        console.log("Skipping title search based on analysis");
    }

    // 2b. Search by author (only if needed)
    if (shouldSearchAuthor) {
        const authorKey = `author:${searchTerm.toLowerCase()}`;
        promises.push(
            dedupeRequest(authorKey, () =>
                searchByAuthorInService(searchTerm).catch(error => {
                    console.error(`Error searching by author with term "${searchTerm}" in service:`, error);
                    return [];
                })
            )
        );
        promiseLabels.push("Author search");
    } else {
        console.log("Skipping author search based on analysis");
    }

    // 3. Adding intelligent AND search action based on analysis
    if (analysis.tryBoth) {
        // 3a. For ambiguous 2-word combinations, try both word orders

        // Option 1: Word 1 as author, word 2 as title
        const option1Key = `combined:${analysis.option1.authorTerm.toLowerCase()};${analysis.option1.titleTerm.toLowerCase()}`;
        console.log(`API call for combined (option 1): /author,title/${encodeURIComponent(analysis.option1.authorTerm)};${encodeURIComponent(analysis.option1.titleTerm)}`);
        promises.push(
            dedupeRequest(option1Key, () =>
                fetchPoemsFromPoetryDBByAuthorAndTitle(
                    analysis.option1.authorTerm,
                    analysis.option1.titleTerm
                ).catch(error => {
                    console.error(`Error with combined search option 1 with author="${analysis.option1.authorTerm}", title="${analysis.option1.titleTerm}":`, error);
                    return [];
                })
            )
        );
        promiseLabels.push("Option 1 (word1=author, word2=title)");

        // Option 2: Word 2 as author, word 1 as title
        const option2Key = `combined:${analysis.option2.authorTerm.toLowerCase()};${analysis.option2.titleTerm.toLowerCase()}`;
        console.log(`API call for combined (option 2): /author,title/${encodeURIComponent(analysis.option2.authorTerm)};${encodeURIComponent(analysis.option2.titleTerm)}`);
        promises.push(
            dedupeRequest(option2Key, () =>
                fetchPoemsFromPoetryDBByAuthorAndTitle(
                    analysis.option2.authorTerm,
                    analysis.option2.titleTerm
                ).catch(error => {
                    console.error(`Error with combined search option 2 with author="${analysis.option2.authorTerm}", title="${analysis.option2.titleTerm}":`, error);
                    return [];
                })
            )
        );
        promiseLabels.push("Option 2 (word2=author, word1=title)");
    } else if (analysis.titleTerm || analysis.searchStrategy === 'combined') {
        // 3b. Use the analysis to perform a targeted AND search (only if we have both terms or high confidence)
        const shouldDoCombined = analysis.titleTerm && analysis.authorTerm &&
            (analysis.searchStrategy === 'combined' || analysis.confidence === 'high');

        if (shouldDoCombined) {
            const combinedKey = `combined:${analysis.authorTerm.toLowerCase()};${analysis.titleTerm.toLowerCase()}`;
            console.log(`API call for combined: /author,title/${encodeURIComponent(analysis.authorTerm)};${encodeURIComponent(analysis.titleTerm)}`);
            promises.push(
                dedupeRequest(combinedKey, () =>
                    fetchPoemsFromPoetryDBByAuthorAndTitle(
                        analysis.authorTerm,
                        analysis.titleTerm
                    ).catch(error => {
                        console.error(`Error with combined search with author="${analysis.authorTerm}", title="${analysis.titleTerm}":`, error);
                        return [];
                    })
                )
            );
            promiseLabels.push("Combined author-title search");
        } else {
            console.log("Skipping combined search - no title term or not needed based on strategy");
        }
    }

    // 4. Apply filters (if present)
    // This is a concept that can be further developed
    if (Object.keys(filters).length > 0) {
        console.log("Applying filters:", filters);
        // Here you could add extra filter-specific search logic
    }

    // 5. Execute all search queries and collect results
    if (promises.length === 0) {
        console.log("No searches to perform based on analysis");
        return [];
    }

    let resultsWithLabels;
    try {
        const results = await Promise.all(promises);

        // Map results to their labels
        resultsWithLabels = results.map((result, index) => ({
            label: promiseLabels[index],
            data: result || []
        }));

        // Log results
        resultsWithLabels.forEach(({label, data}) => {
            console.log(`Results from ${label}: ${data.length} poems found`);
        });
    } catch (error) {
        console.error("Unexpected error during Promise.all in searchPoemsGeneral:", error);
        return [];
    }

    // 6. Combine all results with metadata
    let allResults = [];

    // Process each result set with appropriate scoring
    resultsWithLabels.forEach(({label, data}) => {
        if (label.includes("Option 1")) {
            allResults.push(...data.map(p => ({...p, matchType: 'two_words_option1', score: 5})));
        } else if (label.includes("Option 2")) {
            allResults.push(...data.map(p => ({...p, matchType: 'two_words_option2', score: 6})));
        } else if (label.includes("Combined")) {
            allResults.push(...data.map(p => ({...p, matchType: 'author_and_title', score: 1})));
        } else if (label.includes("Title")) {
            allResults.push(...data.map(p => ({...p, matchType: 'title_search', score: 10})));
        } else if (label.includes("Author")) {
            allResults.push(...data.map(p => ({...p, matchType: 'author_search', score: 20})));
        }
    });

    // 7. Deduplicate results
    const uniqueResults = [];
    const seenPoems = new Set();

    for (const poem of allResults) {
        const poemKey = `${poem.title}-${poem.author}`.toLowerCase();
        if (!seenPoems.has(poemKey)) {
            uniqueResults.push(poem);
            seenPoems.add(poemKey);
        }
    }

    // 8. Sort based on score/relevance
    uniqueResults.sort((a, b) => {
        // First sort by score (lower = better)
        const scoreDiff = a.score - b.score;
        if (scoreDiff !== 0) return scoreDiff;

        // For equal scores, alphabetically by author and then title
        const authorComp = a.author.localeCompare(b.author);
        if (authorComp !== 0) return authorComp;

        return a.title.localeCompare(b.title);
    });

    console.log(`Total ${uniqueResults.length} unique results found`);
    return uniqueResults;
}


/**
 * Zoek gedichten op titel (behoudt de originele specialisatie als nodig).
 *
 * @description Search poems by title (maintains the original specialization if needed).
 * @param {string} title De titel om op te zoeken. / The title to search for.
 * @returns {Promise<Array<object>>} Found poems
 */
// UNUSED: export async function searchPoemsByTitle(title) {
//     // This function can continue to exist if you want explicit "search by title only"
//     // functionality, otherwise it can be removed if searchPoemsGeneral is sufficient.
//     return searchByTitleInService(title);
// }


/**
 * Zoek gedichten op auteur (behoudt de originele specialisatie als nodig).
 *
 * @description Search poems by author (maintains the original specialization if needed).
 * @param {string} author De auteur om op te zoeken. / The author to search for.
 * @returns {Promise<Array<object>>} Found poems
 */
// UNUSED: export async function searchPoemsByAuthor(author) {
//     return searchByAuthorInService(author);
// }


/**
 * Concept voor een functie die zoeken met filters toepast.
 * Dit is een opzet die verder uitgewerkt kan worden.
 *
 * @description Concept for a function that applies filtered search.
 * This is a setup that can be further developed.
 *
 * @param {string} searchTerm De zoekterm / The search term
 * @param {Object} filters De toegepaste filters / The applied filters
 * @returns {Promise<Array<object>>} Gefilterde resultaten / Filtered results
 */
// TODO implementeren