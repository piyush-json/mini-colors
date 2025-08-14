import {
  RetroButton,
  RetroCard,
  RetroColorSwatch,
  RetroProgressBar,
  RetroBadge,
} from "./RetroUI";
import { ColorSDK } from "@/lib/color-sdk";

interface ColorMatch {
  targetColor: string;
  capturedColor: string;
  finalScore: number;
  similarity: number;
  timeScore: number;
  timeTaken: number;
}

interface ResultsScreenProps {
  lastResult: ColorMatch;
  onPlayAgain: () => void;
  onResetGame: () => void;
  onShowStats: () => void;
  onShowHistory: () => void;
  onBackToMenu: () => void;
  getScoreColor: (score: number) => string;
  getScoreMessage: (score: number) => string;
  getDifficultyLevel: (score: number) => { level: string; color: string };
  getAccessibilityDescription: (color: string) => string;
}

export const ResultsScreen = ({
  lastResult,
  onPlayAgain,
  onResetGame,
  onShowStats,
  onShowHistory,
  onBackToMenu,
  getScoreColor,
  getScoreMessage,
  getDifficultyLevel,
  getAccessibilityDescription,
}: ResultsScreenProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="font-mono text-3xl md:text-4xl font-bold text-foreground mb-2">
            🎉 Game Results!
          </h1>
          <p className="font-mono text-lg text-foreground-muted">
            Here's how you did on your color hunt
          </p>
        </div>

        <RetroCard className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="font-mono text-lg font-bold mb-2">
                Target Color
              </div>
              <RetroColorSwatch
                color={lastResult.targetColor}
                size="md"
                showHex
              />
              <div className="mt-2 font-mono text-sm">
                {ColorSDK.getColorName(lastResult.targetColor)}
              </div>
            </div>

            <div className="text-center">
              <div className="font-mono text-lg font-bold mb-2">Your Color</div>
              <RetroColorSwatch
                color={lastResult.capturedColor}
                size="md"
                showHex
              />
              <div className="mt-2 font-mono text-sm">
                {ColorSDK.getColorName(lastResult.capturedColor)}
              </div>
            </div>

            <div className="text-center">
              <div className="font-mono text-lg font-bold mb-2">
                Final Score
              </div>
              <div
                className={`text-4xl font-mono font-bold ${getScoreColor(lastResult.finalScore)}`}
              >
                {lastResult.finalScore}
              </div>
              <div className="mt-2 font-mono text-sm text-foreground-muted">
                {getScoreMessage(lastResult.finalScore)}
              </div>
              <div className="mt-2">
                <RetroBadge
                  variant={
                    getDifficultyLevel(lastResult.finalScore).color as any
                  }
                >
                  {getDifficultyLevel(lastResult.finalScore).level}
                </RetroBadge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <div className="font-mono text-sm font-bold mb-2">
                Color Accuracy
              </div>
              <RetroProgressBar
                value={100 - lastResult.similarity}
                max={100}
                label={`Similarity: ${100 - lastResult.similarity}% (Difference: ${lastResult.similarity}%)`}
              />
            </div>
            <div>
              <div className="font-mono text-sm font-bold mb-2">
                Speed Bonus
              </div>
              <RetroProgressBar
                value={lastResult.timeScore}
                max={30}
                label={`Time: ${lastResult.timeTaken}s`}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <RetroButton
              onClick={onPlayAgain}
              variant="primary"
              size="lg"
              className="flex-1"
            >
              🎮 PLAY AGAIN
            </RetroButton>
            <RetroButton
              onClick={onResetGame}
              variant="secondary"
              size="lg"
              className="flex-1"
            >
              🔄 RESET GAME
            </RetroButton>
          </div>
        </RetroCard>

        <div className="text-center space-x-4">
          <RetroButton onClick={onShowStats} variant="secondary" size="md">
            📊 View Statistics
          </RetroButton>
          <RetroButton onClick={onShowHistory} variant="secondary" size="md">
            📜 Game History
          </RetroButton>
          <RetroButton onClick={onBackToMenu} variant="secondary" size="md">
            ← Back to Menu
          </RetroButton>
        </div>
      </div>
    </div>
  );
};
