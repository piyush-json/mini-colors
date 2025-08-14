import { RetroButton, RetroCard } from "./RetroUI";

interface WelcomeScreenProps {
  onStartGame: () => void;
  onShowStats: () => void;
  onPracticeMode: () => void;
  onDailyMode: () => void;
  onPartyMode: () => void;
  onMixMode: () => void;
  error: string | null;
}

export const WelcomeScreen = ({
  onStartGame,
  onShowStats,
  onPracticeMode,
  onDailyMode,
  onPartyMode,
  onMixMode,
  error,
}: WelcomeScreenProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-mono text-4xl md:text-6xl font-bold text-foreground mb-4">
            🎨 Color Hunter
          </h1>
          <p className="font-mono text-xl text-foreground-muted max-w-2xl mx-auto">
            Test your color perception skills! Choose from 4 exciting mini-games
            to challenge your color matching abilities.
          </p>
        </div>

        {error && (
          <RetroCard title="⚠️ Error" className="mb-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <p className="text-sm text-foreground-muted">
                Don't worry! You can still play in practice mode without a
                camera.
              </p>
            </div>
          </RetroCard>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <RetroCard title="🎯 How to Play">
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <span className="text-blue-500 font-bold">1.</span>
                <p>Choose your favorite mini-game</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-500 font-bold">2.</span>
                <p>Allow camera access when prompted</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-500 font-bold">3.</span>
                <p>Point your camera at an object with the target color</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-500 font-bold">4.</span>
                <p>Capture the color and see your score!</p>
              </div>
            </div>
          </RetroCard>

          <RetroCard title="🏆 Scoring System">
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span>90-100%</span>
                <span className="text-green-600 font-bold">
                  🎯 Perfect Match!
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>80-89%</span>
                <span className="text-green-600 font-bold">🌟 Excellent!</span>
              </div>
              <div className="flex items-center justify-between">
                <span>70-79%</span>
                <span className="text-blue-600 font-bold">👍 Great Job!</span>
              </div>
              <div className="flex items-center justify-between">
                <span>60-69%</span>
                <span className="text-yellow-600 font-bold">😊 Good!</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Below 60%</span>
                <span className="text-orange-600 font-bold">
                  💪 Keep Trying!
                </span>
              </div>
            </div>
          </RetroCard>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <RetroCard title="🌟 Daily Challenge">
            <div className="text-center space-y-4">
              <div className="text-4xl">🌟</div>
              <h3 className="font-mono text-lg font-bold">Daily Color Hunt</h3>
              <p className="text-sm text-foreground-muted">
                A new color every day! Challenge yourself and compete on the
                global leaderboard. Unlimited attempts to beat your best score.
              </p>
              <RetroButton
                onClick={onDailyMode}
                variant="primary"
                size="lg"
                className="w-full"
              >
                🚀 Start Daily Challenge
              </RetroButton>
            </div>
          </RetroCard>

          <RetroCard title="🎉 Party Mode">
            <div className="text-center space-y-4">
              <div className="text-4xl">🎉</div>
              <h3 className="font-mono text-lg font-bold">Local Party Game</h3>
              <p className="text-sm text-foreground-muted">
                Host a party! One person gives a color, others hunt for it.
                Perfect for group fun and friendly competition.
              </p>
              <RetroButton
                onClick={onPartyMode}
                variant="secondary"
                size="lg"
                className="w-full"
              >
                🎮 Start Party Mode
              </RetroButton>
            </div>
          </RetroCard>

          <RetroCard title="🎨 Color Mixing">
            <div className="text-center space-y-4">
              <div className="text-4xl">🎨</div>
              <h3 className="font-mono text-lg font-bold">Mix Two Colors</h3>
              <p className="text-sm text-foreground-muted">
                Blend colors in perfect proportions! Mix two colors to create
                the target color. Test your color theory knowledge.
              </p>
              <RetroButton
                onClick={onMixMode}
                variant="secondary"
                size="lg"
                className="w-full"
              >
                🎨 Start Mixing
              </RetroButton>
            </div>
          </RetroCard>

          <RetroCard title="🔮 Coming Soon">
            <div className="text-center space-y-4">
              <div className="text-4xl">🔮</div>
              <h3 className="font-mono text-lg font-bold">Mystery Game</h3>
              <p className="text-sm text-foreground-muted">
                A brand new color challenge is in development! Stay tuned for
                exciting updates and new gameplay modes.
              </p>
              <RetroButton
                onClick={() => {}}
                disabled
                variant="secondary"
                size="lg"
                className="w-full opacity-50"
              >
                🔒 Coming Soon
              </RetroButton>
            </div>
          </RetroCard>
        </div>

        <div className="text-center space-y-4">
          <RetroButton
            onClick={onPracticeMode}
            variant="secondary"
            size="lg"
            className="max-w-xs"
          >
            🎯 Practice Mode (No Camera)
          </RetroButton>
          <RetroButton onClick={onShowStats} variant="secondary" size="md">
            📊 View Statistics
          </RetroButton>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-foreground-muted">
            💡 <strong>Tip:</strong> Good lighting and a steady hand will
            improve your color accuracy!
          </p>
        </div>
      </div>
    </div>
  );
};
