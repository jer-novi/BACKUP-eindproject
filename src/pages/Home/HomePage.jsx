/**
 * HomePage Component
 *
 * The main landing page for the gedichtgevel.nl application.
 * Displays welcome message and search functionality.
 *
 * @module pages/Home/HomePage
 */

import {useState, useEffect} from 'react';
import {useSearchParams} from 'react-router';
import SearchBar from "@/components/search/SearchBar.jsx";
import SearchResults from "@/components/search/SearchResults.jsx";
import SearchLoadingState from "@/components/search/SearchLoadingState.jsx";
import SearchErrorBoundary from "@/components/search/SearchErrorBoundary.jsx";
import Footer from "@/layouts/Footer/Footer.jsx";
import MonthlyPoems from "@/components/monthly/MonthlyPoems.jsx";
import {useSearchPoems} from "@/hooks/search/useSearchPoems.js";
import {useCanvasNavigation} from "@/hooks/canvas/useCanvasNavigation.js";
import {scrollToSearchResults} from "@/utils/poemHeightCalculator.js";
import searchContextService from "@/services/context/searchContextService";
import styles from './HomePage.module.scss';

/**
 * HomePage component
 *
 * @component
 * @returns {JSX.Element} Home page component
 */
export function HomePage() {
    const [searchParams] = useSearchParams();
    const [focusStudioOpen, setFocusStudioOpen] = useState(false);
    const [focusSearchTerm, setFocusSearchTerm] = useState('');

    // Canvas navigation hook
    const { navigateToCanvas } = useCanvasNavigation();

    // Render welcome message and search bar
    // Handle any error states
    const {
        searchTerm,
        results,
        loading,
        error,
        handleSearch,
        updateSearchTerm,
        searchMeta,
        carouselPosition
    } = useSearchPoems('homepage');


    // Bepaal search state gebaseerd op hook
    const getSearchState = () => {
        if (loading) return 'searching';
        if (searchMeta.hasResults) return 'results';
        if (error) return 'error';
        return 'idle';
    };

    const searchState = getSearchState();

    // Handle canvas navigation from search results
    const handleNavigateToCanvas = (poemData) => {
        try {
            console.log('🎨 HomePage: Navigating to canvas with poem:', poemData?.title);

            // Validate that we have the navigation function
            if (!navigateToCanvas) {
                throw new Error('Navigation function not available');
            }

            navigateToCanvas(poemData, { source: 'search' });
        } catch (error) {
            console.error('❌ Failed to navigate to canvas:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                poemData: poemData,
            });
            // TODO: Show user-friendly error message (toast/notification)
            alert('Er ging iets mis bij het openen van het gedicht in de canvas. Probeer het opnieuw.');
        }
    };

    // Handle URL parameters for Focus Studio auto-open
    useEffect(() => {
        const focusParam = searchParams.get('focus');
        const termParam = searchParams.get('term');

        if (focusParam === 'true') {
            // Auto-open Focus Studio from URL parameters
            const termToUse = termParam || searchTerm;
            if (termToUse) {
                console.log('[Homepage] Auto-opening Focus Studio from URL:', termToUse);
                setFocusSearchTerm(termToUse);
                setFocusStudioOpen(true);

                // Update search term if provided in URL
                if (termParam && termParam !== searchTerm) {
                    updateSearchTerm(termParam);
                }

                // Auto-trigger search with term
                if (termToUse.trim()) {
                    handleSearch(termToUse);
                }
            }
        }
    }, [searchParams, searchTerm, updateSearchTerm, handleSearch]);

    return (
        <div className={styles.homePage}>
            {/* Hero Section - Text Container P2 */}
            <div className={styles.heroSection}>
                <div className={styles.heroContainer}>
                    <h1 className={styles.heroHeading}>
                        Ontketen je creativiteit met poëzie
                    </h1>
                    <p className={styles.heroParagraph}>
                        Duik in een wereld waar poëzie en architectuur samenkomen.<br/>
                        Ontdek, neem op en personaliseer je poëtische uitingen als nooit tevoren.
                    </p>
                </div>
            </div>

            {/* Main Search Section */}
            <div className={styles.searchSection}>
                {/* ZOEK GEDICHTEN CTA Header */}
                <div className={styles.searchCTAContainer}>
                    <div className={styles.searchCTA}>
                        <div className={styles.searchCTATagline}>
                            ZOEK GEDICHTEN
                        </div>
                        <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M10.5 3C14.0899 3 17 5.91015 17 9.5C17 11.11 16.4105 12.5816 15.4424 13.7111L20.7071 18.9759C21.0976 19.3664 21.0976 19.9995 20.7071 20.39C20.3525 20.7446 19.7894 20.7796 19.3945 20.4949L19.2929 20.39L14.0281 15.1253C12.8986 16.0935 11.5085 16.625 10 16.625C6.41015 16.625 3.5 13.7149 3.5 10.125C3.5 6.53515 6.41015 3.625 10 3.625L10.5 3ZM10.5 5.5C7.73858 5.5 5.5 7.73858 5.5 10.5C5.5 13.2614 7.73858 15.5 10.5 15.5C13.2614 15.5 15.5 13.2614 15.5 10.5C15.5 7.73858 13.2614 5.5 10.5 5.5Z"
                                fill="currentColor"/>
                        </svg>
                    </div>
                </div>

                {/* Search Container with Filter Bar and Search Bar */}
                <div className={styles.searchContainer}>
                    {/* Filter Bar - direct boven search bar */}
                    <div className={styles.filterBarContainer}>
                        <div className={styles.filterBar}>
                            <div className={styles.filterContainer}>
                                <div className={styles.filterItem}>
                                    <span className={styles.filterText}>Taal</span>
                                    <div className={styles.dropdownArrow}>
                                        <svg className={styles.arrowVector} viewBox="0 0 21 16">
                                            <path d="M0 0L21 0L10.5 15L0 0Z" fill="#EFEFEF"/>
                                        </svg>
                                    </div>
                                </div>

                                <div className={styles.filterItem}>
                                    <span className={styles.filterText}>Lengte</span>
                                    <div className={styles.dropdownArrow}>
                                        <svg className={styles.arrowVector} viewBox="0 0 21 16">
                                            <path d="M0 0L21 0L10.5 15L0 0Z" fill="#EFEFEF"/>
                                        </svg>
                                    </div>
                                </div>

                                <div className={styles.filterItem}>
                                    <span className={styles.filterText}>Tijdperk</span>
                                    <div className={styles.dropdownArrow}>
                                        <svg className={styles.arrowVector} viewBox="0 0 21 16">
                                            <path d="M0 0L21 0L10.5 15L0 0Z" fill="#EFEFEF"/>
                                        </svg>
                                    </div>
                                </div>

                                <div className={styles.filterItem}>
                                    <span className={styles.filterText}>Creative Canvas</span>
                                    <div className={styles.dropdownArrow}>
                                        <svg className={styles.arrowVector} viewBox="0 0 21 16">
                                            <path d="M0 0L21 0L10.5 15L0 0Z" fill="#EFEFEF"/>
                                        </svg>
                                    </div>
                                </div>

                                <div className={styles.filterItemAdvanced}>
                                    <span className={styles.filterTextAdvanced}>Meer Filters</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <SearchErrorBoundary>
                        <SearchBar
                            onSearch={handleSearch}
                            searchTerm={searchTerm}
                            onSearchTermChange={updateSearchTerm}
                        />
                    </SearchErrorBoundary>
                </div>

                {/* Search Results Area - alleen zichtbaar bij search */}
                {searchState !== 'idle' && (
                    <div className={styles.searchResultsArea}>
                        {searchState === 'searching' && (
                            <SearchLoadingState/>
                        )}

                        {searchState === 'results' && (
                            <SearchErrorBoundary>
                                <SearchResults
                                    results={results}
                                    // onOpenFocusStudio={handleOpenFocusStudio}
                                    searchTerm={searchTerm}
                                    hideSeriesNavigation={false}
                                    initialIndex={carouselPosition}
                                    onNavigateToCanvas={handleNavigateToCanvas}
                                />
                            </SearchErrorBoundary>
                        )}

                        {searchState === 'error' && (
                            <div className={styles.searchError}>
                                <p>{error}</p>
                            </div>
                        )}

                    </div>
                )}
            </div>

            {/* USP Section - altijd zichtbaar */}
            <div className={styles.uspSection}>
                <div className={styles.uspContainer}>
                    <div className={styles.uspColumn}>
                        <div className={styles.uspContent}>
                            <div className={styles.uspHeading}>
                                <h3>Ontdek Poezie Als Nooit Tevoren</h3>
                            </div>
                            <p>Zoek direct hierboven of ga naar geavanceerd zoeken voor uitgebreide gedichten inspiratie</p>
                        </div>
                    </div>

                    <div className={styles.uspColumn}>
                        <div className={styles.uspContent}>
                            <div className={styles.uspHeading}>
                                <h3>Hardop: Spreek jouw favoriete gedicht in</h3>
                            </div>
                            <p>Leg je voordrachten vast en deel je unieke stem, of laat iemand jouw gedicht voordragen</p>
                        </div>
                    </div>

                    <div className={styles.uspColumn}>
                        <div className={styles.uspContent}>
                            <div className={styles.uspHeading}>
                                <h3>Pas jouw poëzie-ervaring aan</h3>
                            </div>
                            <p>Voeg visuele elementen toe om je poëzie echt van jou te maken en bekijk ze op een gevel naar keuze</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gedichten van de Maand - nieuwe MonthlyPoems component */}
            <MonthlyPoems/>

            {/* Footer - altijd onderaan */}
            <Footer/>
        </div>

    );
}