import { useState, useEffect } from 'react';
import { BookOpen, Plus, Layers, TrendingUp } from 'lucide-react';
import { DeckList } from './components/DeckList';
import { StudyMode } from './components/StudyMode';
import { CreateDeck } from './components/CreateDeck';
import { Statistics } from './components/Statistics';

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  nextReview: number;
  interval: number;
  easeFactor: number;
  reviews: number;
}

export interface Deck {
  id: string;
  name: string;
  description: string;
  color: string;
  cards: Flashcard[];
  createdAt: number;
}

type View = 'decks' | 'study' | 'create' | 'stats';

export default function App() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [currentView, setCurrentView] = useState<View>('decks');
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);

  // Load decks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('flashcard-decks');
    if (saved) {
      setDecks(JSON.parse(saved));
    } else {
      // Create sample deck if none exists
      const sampleDeck: Deck = {
        id: '1',
        name: 'JavaScript Basics',
        description: 'Core JavaScript concepts',
        color: 'from-yellow-500 to-orange-500',
        createdAt: Date.now(),
        cards: [
          {
            id: '1',
            front: 'What is a closure?',
            back: 'A closure is a function that has access to variables in its outer (enclosing) lexical scope, even after the outer function has returned.',
            nextReview: Date.now(),
            interval: 0,
            easeFactor: 2.5,
            reviews: 0,
          },
          {
            id: '2',
            front: 'What is the difference between let and var?',
            back: 'let is block-scoped and cannot be redeclared, while var is function-scoped and can be redeclared.',
            nextReview: Date.now(),
            interval: 0,
            easeFactor: 2.5,
            reviews: 0,
          },
          {
            id: '3',
            front: 'What is a Promise?',
            back: 'A Promise is an object representing the eventual completion or failure of an asynchronous operation.',
            nextReview: Date.now(),
            interval: 0,
            easeFactor: 2.5,
            reviews: 0,
          },
        ],
      };
      setDecks([sampleDeck]);
    }
  }, []);

  // Save decks to localStorage
  useEffect(() => {
    if (decks.length > 0) {
      localStorage.setItem('flashcard-decks', JSON.stringify(decks));
    }
  }, [decks]);

  const createDeck = (deck: Omit<Deck, 'id' | 'createdAt'>) => {
    const newDeck: Deck = {
      ...deck,
      id: Date.now().toString(),
      createdAt: Date.now(),
    };
    setDecks([...decks, newDeck]);
    setCurrentView('decks');
  };

  const deleteDeck = (deckId: string) => {
    setDecks(decks.filter((d) => d.id !== deckId));
  };

  const updateDeck = (updatedDeck: Deck) => {
    setDecks(decks.map((d) => (d.id === updatedDeck.id ? updatedDeck : d)));
    if (selectedDeck?.id === updatedDeck.id) {
      setSelectedDeck(updatedDeck);
    }
  };

  const startStudying = (deck: Deck) => {
    setSelectedDeck(deck);
    setCurrentView('study');
  };

  // Calculate stats
  const totalCards = decks.reduce((sum, deck) => sum + deck.cards.length, 0);
  const totalReviews = decks.reduce(
    (sum, deck) => sum + deck.cards.reduce((s, card) => s + card.reviews, 0),
    0
  );
  const dueCards = decks.reduce(
    (sum, deck) => sum + deck.cards.filter((card) => card.nextReview <= Date.now()).length,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-10 h-10 text-blue-400" />
              <div>
                <h1 className="text-4xl font-bold text-white">FlashMaster</h1>
                <p className="text-gray-400 text-sm">Spaced repetition learning</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentView('decks')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  currentView === 'decks'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Layers className="w-4 h-4" />
                Decks
              </button>

              <button
                onClick={() => setCurrentView('stats')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  currentView === 'stats'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Stats
              </button>

              <button
                onClick={() => setCurrentView('create')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Deck
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {/* Quick stats */}
        {currentView !== 'stats' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Total Cards</p>
              <p className="text-3xl font-bold text-white">{totalCards}</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Cards Due</p>
              <p className="text-3xl font-bold text-orange-400">{dueCards}</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Total Reviews</p>
              <p className="text-3xl font-bold text-green-400">{totalReviews}</p>
            </div>
          </div>
        )}

        {/* Views */}
        {currentView === 'decks' && (
          <DeckList
            decks={decks}
            onStartStudying={startStudying}
            onDeleteDeck={deleteDeck}
          />
        )}

        {currentView === 'study' && selectedDeck && (
          <StudyMode
            deck={selectedDeck}
            onUpdateDeck={updateDeck}
            onExit={() => setCurrentView('decks')}
          />
        )}

        {currentView === 'create' && (
          <CreateDeck
            onCreateDeck={createDeck}
            onCancel={() => setCurrentView('decks')}
          />
        )}

        {currentView === 'stats' && <Statistics decks={decks} />}
      </main>
    </div>
  );
}