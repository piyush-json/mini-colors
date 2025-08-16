// "use client";

// import { useState, useEffect } from "react";
// import { useSocket } from "./socket-provider";
// import { FindColorGame } from "./FindColorGame";
// import { ColorMixingGame } from "./ColorMixingGame";
// import { QRCodeSVG } from "qrcode.react";
// import { cn } from "@/lib/utils";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";

// // Step 1: Landing screen with join/create buttons
// const LandingScreen = ({
//   onShowCreate,
//   onShowJoin,
// }: {
//   onShowCreate: () => void;
//   onShowJoin: () => void;
// }) => (
//   <div className="min-h-screen bg-[#FFFFE7] p-4 font-mono">
//     <div className="w-full pt-8">
//       {/* Header with title */}
//       <div className="text-center mb-16">
//         <h1 className="font-hartone font-extralight  text-[39px] leading-[42px] text-black mb-2">
//           PARTY MODE
//         </h1>
//         <p className="font-sintony text-[14px] leading-[16px] text-black">
//           Play together with your friends
//         </p>
//       </div>

//       {/* Central Circle with Character */}
//       <div className="flex justify-center mb-32">
//         <div className="w-48 h-48 sm:w-52 sm:h-52 rounded-full border border-black flex items-center justify-center relative bg-white">
//           <span className="text-6xl">🎨</span>
//         </div>
//       </div>

//       {/* Action buttons */}
//       <div className="space-y-3">
//         <button
//           onClick={onShowCreate}
//           className="w-full h-16 sm:h-[68px] bg-[#FFE254] border border-black rounded-[39px] shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-hartone font-extralight  text-xl sm:text-[34px] leading-[37px] tracking-[2.55px] text-black transition-all duration-150 hover:shadow-[0px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]"
//         >
//           CREATE ROOM
//         </button>

//         <button
//           onClick={onShowJoin}
//           className="w-full h-16 sm:h-[68px] bg-white border border-black rounded-[39px] shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-hartone font-extralight  text-xl sm:text-[34px] leading-[37px] tracking-[2.55px] text-black transition-all duration-150 hover:shadow-[0px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]"
//         >
//           JOIN ROOM
//         </button>
//       </div>
//     </div>
//   </div>
// );

// // Step 2a: Create room form
// const CreateRoomForm = ({
//   playerName,
//   setPlayerName,
//   maxPlayers,
//   setMaxPlayers,
//   maxRounds,
//   setMaxRounds,
//   guessTime,
//   setGuessTime,
//   onCreateRoom,
//   onBack,
//   showQRCode,
//   setShowQRCode,
// }: {
//   playerName: string;
//   setPlayerName: (name: string) => void;
//   maxPlayers: number;
//   setMaxPlayers: (count: number) => void;
//   maxRounds: number;
//   setMaxRounds: (rounds: number) => void;
//   guessTime: number;
//   setGuessTime: (time: number) => void;
//   onCreateRoom: () => void;
//   onBack: () => void;
//   showQRCode: boolean;
//   setShowQRCode: (show: boolean) => void;
// }) => (
//   <div className="min-h-screen bg-[#FFFFE7] font-mono w-full">
//     <div className="w-full pt-8">
//       {/* Header */}
//       <div className="text-center mb-8">
//         <h1 className="font-hartone font-extralight  text-[39px] leading-[42px] text-black mb-2">
//           CREATE ROOM
//         </h1>
//         <p className="font-sintony text-[14px] leading-[16px] text-black">
//           Create room with your friends
//         </p>
//       </div>

//       {/* Players section with avatars */}

//       {/* Game settings */}
//       <div className="bg-white border-2 border-black rounded-[21px] p-8 mb-8">
//         <div className="space-y-6">
//           {/* Rounds */}
//           <div className="space-y-2">
//             <label className="font-hartone font-extralight   text-[18px] leading-[42px] text-black">
//               Rounds
//             </label>
//             <Select
//               value={maxRounds.toString()}
//               onValueChange={(value) => setMaxRounds(Number(value))}
//             >
//               <SelectTrigger className="w-full h-[40px] bg-white border-2 border-black rounded-[7px] px-3 font-sintony text-[16px] text-black focus:ring-2 focus:ring-black hover:bg-gray-50">
//                 <SelectValue placeholder="Select rounds" />
//               </SelectTrigger>
//               <SelectContent className="bg-white border-2 border-black rounded-[7px] font-sintony">
//                 <SelectItem
//                   value="1"
//                   className="text-black hover:bg-[#FFE254] focus:bg-[#FFE254]"
//                 >
//                   1 Round
//                 </SelectItem>
//                 <SelectItem
//                   value="3"
//                   className="text-black hover:bg-[#FFE254] focus:bg-[#FFE254]"
//                 >
//                   3 Rounds
//                 </SelectItem>
//                 <SelectItem
//                   value="5"
//                   className="text-black hover:bg-[#FFE254] focus:bg-[#FFE254]"
//                 >
//                   5 Rounds
//                 </SelectItem>
//                 <SelectItem
//                   value="10"
//                   className="text-black hover:bg-[#FFE254] focus:bg-[#FFE254]"
//                 >
//                   10 Rounds
//                 </SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Guess Time */}
//           <div className="space-y-2">
//             <label className="font-hartone font-extralight   text-[18px] leading-[42px] text-black">
//               GUESS TIME
//             </label>
//             <Select
//               value={guessTime.toString()}
//               onValueChange={(value) => setGuessTime(Number(value))}
//             >
//               <SelectTrigger className="w-full h-[40px] bg-white border-2 border-black rounded-[7px] px-3 font-sintony text-[16px] text-black focus:ring-2 focus:ring-black hover:bg-gray-50">
//                 <SelectValue placeholder="Select time limit" />
//               </SelectTrigger>
//               <SelectContent className="bg-white border-2 border-black rounded-[7px] font-sintony">
//                 <SelectItem
//                   value="15"
//                   className="text-black hover:bg-[#FFE254] focus:bg-[#FFE254]"
//                 >
//                   15 seconds
//                 </SelectItem>
//                 <SelectItem
//                   value="30"
//                   className="text-black hover:bg-[#FFE254] focus:bg-[#FFE254]"
//                 >
//                   30 seconds
//                 </SelectItem>
//                 <SelectItem
//                   value="60"
//                   className="text-black hover:bg-[#FFE254] focus:bg-[#FFE254]"
//                 >
//                   60 seconds
//                 </SelectItem>
//                 <SelectItem
//                   value="120"
//                   className="text-black hover:bg-[#FFE254] focus:bg-[#FFE254]"
//                 >
//                   2 minutes
//                 </SelectItem>
//                 <SelectItem
//                   value="300"
//                   className="text-black hover:bg-[#FFE254] focus:bg-[#FFE254]"
//                 >
//                   5 minutes
//                 </SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           {/* No of Players */}
//           <div className="space-y-2">
//             <label className="font-hartone font-extralight   text-[18px] leading-[42px] text-black">
//               NO OF PLAYERS
//             </label>
//             <select
//               value={maxPlayers}
//               onChange={(e) => setMaxPlayers(Number(e.target.value))}
//               className="w-full h-[40px] bg-white border border-black rounded-[7px] px-3 font-sintony text-[16px] text-black focus:outline-none focus:ring-2 focus:ring-black"
//             >
//               <option value={2}>2 Players</option>
//               <option value={4}>4 Players</option>
//               <option value={6}>6 Players</option>
//               <option value={8}>8 Players</option>
//               <option value={12}>12 Players</option>
//             </select>
//           </div>

//           {/* Game */}
//           <div className="space-y-2">
//             <label className="font-hartone font-extralight   text-[18px] leading-[42px] text-black">
//               GAME
//             </label>
//             <div className="w-full h-[40px] bg-[#F5F5F5] border border-black rounded-[7px] flex items-center px-3">
//               <span className="font-sintony text-[16px] text-gray-600">
//                 Selected by denner in lobby
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Invite button */}
//         <div className="flex justify-center mt-8">
//           <button
//             onClick={() => setShowQRCode(!showQRCode)}
//             className="bg-black text-[#FFFFE7] font-hartone font-extralight  text-[16px] leading-[16px] tracking-[1.2px] px-[35px] py-[10px] rounded-[8px] hover:bg-gray-800 transition-colors"
//           >
//             {showQRCode ? "HIDE QR" : "INVITE"}
//           </button>
//         </div>

//         {/* QR Code display */}
//         {showQRCode && (
//           <div className="flex justify-center mt-6">
//             <div className="bg-white p-4 border border-black rounded-lg">
//               <QRCodeSVG
//                 value={
//                   typeof window !== "undefined"
//                     ? `${window.location.origin}/party`
//                     : "https://example.com/party"
//                 }
//                 size={128}
//               />
//               <p className="text-center mt-2 font-sintony text-[12px] text-gray-600">
//                 Scan to join party mode
//               </p>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Player name input */}
//       <div className="mb-6">
//         <input
//           type="text"
//           placeholder="Enter your name"
//           value={playerName}
//           onChange={(e) => setPlayerName(e.target.value)}
//           className="w-full h-[52px] bg-white border border-black rounded-[12px] px-4 font-sintony text-[16px] text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
//         />
//       </div>

//       {/* Action buttons */}
//       <div className="space-y-3">
//         <button
//           onClick={onCreateRoom}
//           disabled={!playerName.trim()}
//           className={cn(
//             "w-full h-[68px] border border-black rounded-[39px] shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-hartone font-extralight   text-[34px] leading-[37px] tracking-[2.55px] transition-all duration-150",
//             playerName.trim()
//               ? "bg-[#FFE254] text-black cursor-pointer hover:shadow-[0px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]"
//               : "bg-gray-300 text-gray-500 cursor-not-allowed",
//           )}
//         >
//           PLAY
//         </button>

//         <button
//           onClick={onBack}
//           className="w-full h-[52px] bg-white border border-black rounded-[39px] shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-hartone font-extralight  text-[18px] leading-[20px] tracking-[1.35px] text-black transition-all duration-150 hover:shadow-[0px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]"
//         >
//           BACK
//         </button>
//       </div>
//     </div>
//   </div>
// );

// // Step 2b: Join room form
// const JoinRoomForm = ({
//   playerName,
//   setPlayerName,
//   roomId,
//   setRoomId,
//   onJoinRoom,
//   onBack,
// }: {
//   playerName: string;
//   setPlayerName: (name: string) => void;
//   roomId: string;
//   setRoomId: (id: string) => void;
//   onJoinRoom: () => void;
//   onBack: () => void;
// }) => (
//   <div className="min-h-screen bg-[#FFFFE7] p-4 font-mono">
//     <div className="w-full pt-8">
//       {/* Header */}
//       <div className="text-center mb-16">
//         <h1 className="font-hartone font-extralight  text-[39px] leading-[42px] text-black mb-2">
//           JOIN ROOM
//         </h1>
//         <p className="font-sintony text-[14px] leading-[16px] text-black">
//           Join your friends room
//         </p>
//       </div>

//       {/* Form inputs */}
//       <div className="space-y-4 mb-16">
//         <input
//           type="text"
//           placeholder="Enter your name"
//           value={playerName}
//           onChange={(e) => setPlayerName(e.target.value)}
//           className="w-full h-[52px] bg-white border border-black rounded-[12px] px-4 font-sintony text-[16px] text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
//         />

//         <input
//           type="text"
//           placeholder="Enter room code"
//           value={roomId}
//           onChange={(e) => setRoomId(e.target.value.toUpperCase())}
//           className="w-full h-[52px] bg-white border border-black rounded-[12px] px-4 font-sintony text-[16px] text-black placeholder-gray-500 uppercase focus:outline-none focus:ring-2 focus:ring-black"
//         />
//       </div>

//       {/* Action buttons */}
//       <div className="space-y-3">
//         <button
//           onClick={onJoinRoom}
//           disabled={!playerName.trim() || !roomId.trim()}
//           className={cn(
//             "w-full h-[68px] border border-black rounded-[39px] shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-hartone font-extralight   text-[34px] leading-[37px] tracking-[2.55px] transition-all duration-150",
//             playerName.trim() && roomId.trim()
//               ? "bg-[#FFE254] text-black cursor-pointer hover:shadow-[0px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]"
//               : "bg-gray-300 text-gray-500 cursor-not-allowed",
//           )}
//         >
//           JOIN
//         </button>

//         <button
//           onClick={onBack}
//           className="w-full h-[52px] bg-white border border-black rounded-[39px] shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-hartone font-extralight  text-[18px] leading-[20px] tracking-[1.35px] text-black transition-all duration-150 hover:shadow-[0px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]"
//         >
//           BACK
//         </button>
//       </div>
//     </div>
//   </div>
// );

// // Step 3: Lobby where denner selects game type
// const GameLobby = ({
//   gameInfo,
//   isCurrentUserDenner,
//   onSelectGameType,
//   currentRoom,
//   showQRCode,
//   setShowQRCode,
//   getRoomShareUrl,
// }: {
//   gameInfo: any;
//   isCurrentUserDenner: boolean;
//   onSelectGameType: (gameType: "findColor" | "colorMixing") => void;
//   currentRoom: string;
//   showQRCode: boolean;
//   setShowQRCode: (show: boolean) => void;
//   getRoomShareUrl: () => string;
// }) => (
//   <div className="min-h-screen bg-[#FFFFE7] p-4 font-mono">
//     <div className="w-full pt-8">
//       {/* Room header */}
//       <div className="text-center mb-8">
//         <h1 className="font-hartone font-extralight  text-[32px] leading-[35px] text-black mb-2">
//           Room: {currentRoom}
//         </h1>

//         {/* QR Code toggle */}
//         <button
//           onClick={() => setShowQRCode(!showQRCode)}
//           className="font-sintony text-[14px] text-blue-600 underline mb-4"
//         >
//           {showQRCode ? "Hide" : "Show"} QR Code
//         </button>

//         {showQRCode && (
//           <div className="flex justify-center mb-4">
//             <div className="bg-white p-4 border border-black rounded-lg">
//               <QRCodeSVG value={getRoomShareUrl()} size={128} />
//             </div>
//           </div>
//         )}

//         <div className="font-sintony text-[16px] text-black">
//           Waiting for denner {gameInfo.dennerName} to select game type
//         </div>
//       </div>

//       {/* Game selection */}
//       <div className="w-full mb-6">
//         <div className="bg-white border border-black rounded-[12px] shadow-[0px_6px_0px_0px_rgba(0,0,0,1)] p-6 mb-6">
//           <h2 className="font-hartone font-extralight  text-[24px] leading-[26px] text-black mb-4 text-center">
//             🎮 Select Game Type
//           </h2>

//           {isCurrentUserDenner ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <button
//                 onClick={() => onSelectGameType("findColor")}
//                 className="h-[100px] bg-[#FFE254] border border-black rounded-[12px] shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center font-hartone font-extralight   text-[18px] leading-[20px] tracking-[1.35px] text-black transition-all duration-150 hover:shadow-[0px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]"
//               >
//                 🎯 Find Color
//                 <span className="font-sintony text-[12px] mt-1">
//                   Match the target color
//                 </span>
//               </button>

//               <button
//                 onClick={() => onSelectGameType("colorMixing")}
//                 className="h-[100px] bg-[#FFE254] border border-black rounded-[12px] shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center font-hartone font-extralight   text-[18px] leading-[20px] tracking-[1.35px] text-black transition-all duration-150 hover:shadow-[0px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]"
//               >
//                 🎨 Color Mixing
//                 <span className="font-sintony text-[12px] mt-1">
//                   Mix colors to match
//                 </span>
//               </button>
//             </div>
//           ) : (
//             <div className="text-center py-8">
//               <p className="font-sintony text-[16px] text-black">
//                 Waiting for denner <strong>{gameInfo.dennerName}</strong> to
//                 select game type...
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Players list */}
//         <div className="bg-white border border-black rounded-[12px] shadow-[0px_6px_0px_0px_rgba(0,0,0,1)] p-6">
//           <h3 className="font-hartone font-extralight  text-[20px] leading-[22px] text-black mb-4">
//             👥 Players ({gameInfo.playerCount}/{gameInfo.maxPlayers})
//           </h3>
//           <div className="grid grid-cols-2 gap-3">
//             {gameInfo.players?.map((player: any, index: number) => (
//               <div
//                 key={player.id}
//                 className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-300 rounded-lg"
//               >
//                 <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold">
//                   {player.name.charAt(0).toUpperCase()}
//                 </div>
//                 <span className="font-sintony text-[14px] text-black">
//                   {player.name} {player.id === gameInfo.hostId && "👑"}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// // Step 4: Game selection screen (after denner selects type)
// const GameSelectionScreen = ({
//   gameInfo,
//   isCurrentUserDenner,
//   onStartRound,
// }: {
//   gameInfo: any;
//   isCurrentUserDenner: boolean;
//   onStartRound: () => void;
// }) => (
//   <div className="w-full">
//     <div className="bg-white border border-black rounded-[12px] shadow-[0px_6px_0px_0px_rgba(0,0,0,1)] p-6">
//       <h2 className="font-hartone font-extralight  text-[24px] leading-[26px] text-black mb-4 text-center">
//         🎮 {gameInfo.gameType === "findColor" ? "Find Color" : "Color Mixing"}{" "}
//         Game
//       </h2>

//       <div className="text-center space-y-4">
//         <p className="font-sintony text-[16px] text-black">
//           Game type selected:{" "}
//           <strong>
//             {gameInfo.gameType === "findColor" ? "Find Color" : "Color Mixing"}
//           </strong>
//         </p>

//         <p className="font-sintony text-[14px] text-gray-600">
//           Round {gameInfo.currentRound} of {gameInfo.maxRounds}
//         </p>

//         <p className="font-sintony text-[14px] text-gray-600">
//           Guess time: {gameInfo.guessTime} seconds
//         </p>

//         {isCurrentUserDenner ? (
//           <button
//             onClick={onStartRound}
//             className="w-full h-[68px] bg-[#FFE254] border border-black rounded-[39px] shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-hartone font-extralight  text-[30px] leading-[33px] tracking-[2.25px] text-black transition-all duration-150 hover:shadow-[0px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]"
//           >
//             START ROUND
//           </button>
//         ) : (
//           <div className="py-8">
//             <p className="font-sintony text-[16px] text-black">
//               Waiting for denner <strong>{gameInfo.dennerName}</strong> to start
//               the round...
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   </div>
// );

// // Step 5: Round finished screen with modal leaderboard
// const RoundFinishedScreen = ({
//   gameInfo,
//   isCurrentUserDenner,
//   onContinueSession,
//   onEndSession,
//   showLeaderboard,
//   setShowLeaderboard,
// }: {
//   gameInfo: any;
//   isCurrentUserDenner: boolean;
//   onContinueSession: () => void;
//   onEndSession: () => void;
//   showLeaderboard: boolean;
//   setShowLeaderboard: (show: boolean) => void;
// }) => (
//   <div className="w-full">
//     <div className="bg-white border border-black rounded-[12px] shadow-[0px_6px_0px_0px_rgba(0,0,0,1)] p-6">
//       <h2 className="font-hartone font-extralight  text-[24px] leading-[26px] text-black mb-6 text-center">
//         🏁 Round {gameInfo.currentRound} Complete!
//       </h2>

//       <div className="text-center mb-6">
//         <Button
//           onClick={() => setShowLeaderboard(true)}
//           className="bg-[#FFE254] text-black border border-black hover:bg-yellow-300 font-hartone font-extralight  text-[18px]"
//         >
//           View Leaderboard
//         </Button>
//       </div>

//       {/* Denner controls */}
//       {isCurrentUserDenner && (
//         <div className="flex gap-4">
//           {gameInfo.currentRound < gameInfo.maxRounds ? (
//             <button
//               onClick={onContinueSession}
//               className="flex-1 h-[52px] bg-[#FFE254] border border-black rounded-[39px] shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-hartone font-extralight  text-[18px] leading-[20px] tracking-[1.35px] text-black transition-all duration-150 hover:shadow-[0px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]"
//             >
//               NEXT ROUND
//             </button>
//           ) : null}

//           <button
//             onClick={onEndSession}
//             className="flex-1 h-[52px] bg-white border border-black rounded-[39px] shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-hartone font-extralight  text-[18px] leading-[20px] tracking-[1.35px] text-black transition-all duration-150 hover:shadow-[0px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]"
//           >
//             END SESSION
//           </button>
//         </div>
//       )}

//       {!isCurrentUserDenner && (
//         <div className="text-center py-4">
//           <p className="font-sintony text-[16px] text-black">
//             Waiting for denner <strong>{gameInfo.dennerName}</strong> to
//             continue...
//           </p>
//         </div>
//       )}
//     </div>

//     {/* Leaderboard Modal */}
//     <Dialog open={showLeaderboard} onOpenChange={setShowLeaderboard}>
//       <DialogContent className="bg-[#FFFFE7] border-2 border-black">
//         <DialogHeader>
//           <DialogTitle className="font-hartone font-extralight   text-[24px] text-black">
//             Round {gameInfo.currentRound} Leaderboard
//           </DialogTitle>
//           <DialogDescription className="font-sintony text-black">
//             Here are the results for this round
//           </DialogDescription>
//         </DialogHeader>

//         <div className="space-y-3">
//           {gameInfo.players
//             ?.sort((a: any, b: any) => (b.score || 0) - (a.score || 0))
//             .map((player: any, index: number) => (
//               <div
//                 key={player.id}
//                 className="flex items-center justify-between p-3 bg-white border border-black rounded-lg"
//               >
//                 <div className="flex items-center gap-3">
//                   <span className="font-hartone font-extralight  text-[18px] text-black">
//                     #{index + 1}
//                   </span>
//                   <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold">
//                     {player.name.charAt(0).toUpperCase()}
//                   </div>
//                   <span className="font-sintony text-[16px] text-black">
//                     {player.name}
//                   </span>
//                 </div>
//                 <span className="font-hartone font-extralight  text-[18px] text-black">
//                   {player.score || 0} pts
//                 </span>
//               </div>
//             ))}
//         </div>
//       </DialogContent>
//     </Dialog>
//   </div>
// );

// // Session finished screen
// const SessionFinishedScreen = ({
//   gameInfo,
//   onLeaveRoom,
// }: {
//   gameInfo: any;
//   onLeaveRoom: () => void;
// }) => (
//   <div className="w-full">
//     <div className="bg-white border border-black rounded-[12px] shadow-[0px_6px_0px_0px_rgba(0,0,0,1)] p-6">
//       <h2 className="font-hartone font-extralight  text-[24px] leading-[26px] text-black mb-6 text-center">
//         🎊 Session Complete!
//       </h2>

//       {/* Final leaderboard */}
//       <div className="mb-6">
//         <h3 className="font-hartone font-extralight  text-[18px] leading-[20px] text-black mb-4">
//           Final Leaderboard
//         </h3>
//         <div className="space-y-2">
//           {gameInfo.sessionLeaderboard?.map((player: any, index: number) => (
//             <div
//               key={player.id}
//               className="flex items-center justify-between p-3 bg-gray-50 border border-gray-300 rounded-lg"
//             >
//               <div className="flex items-center gap-3">
//                 <span className="font-hartone font-extralight  text-[18px] text-black">
//                   #{player.rank}
//                 </span>
//                 <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold">
//                   {player.name.charAt(0).toUpperCase()}
//                 </div>
//                 <span className="font-sintony text-[16px] text-black">
//                   {player.name}
//                 </span>
//               </div>
//               <span className="font-hartone font-extralight  text-[18px] text-black">
//                 {player.sessionScore} pts
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="text-center">
//         <button
//           onClick={onLeaveRoom}
//           className="w-full h-[68px] bg-[#FFE254] border border-black rounded-[39px] shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-hartone font-extralight  text-[30px] leading-[33px] tracking-[2.25px] text-black transition-all duration-150 hover:shadow-[0px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]"
//         >
//           PLAY AGAIN
//         </button>
//       </div>
//     </div>
//   </div>
// );

// // Main component using mini components
// export const MultiplayerPartyScreen = () => {
//   const [playerName, setPlayerName] = useState("");
//   const [roomId, setRoomId] = useState("");
//   const [showJoinForm, setShowJoinForm] = useState(false);
//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [showQRCode, setShowQRCode] = useState(false);
//   const [showLeaderboard, setShowLeaderboard] = useState(false);

//   // Room configuration state
//   const [maxPlayers, setMaxPlayers] = useState(8);
//   const [maxRounds, setMaxRounds] = useState(3);
//   const [guessTime, setGuessTime] = useState(30);

//   const {
//     isConnected,
//     error: socketError,
//     currentRoom,
//     gameInfo,
//     events,
//     connect,
//     disconnect,
//     createRoom,
//     joinRoom,
//     leaveRoom,
//     selectGameType,
//     startRound,
//     endRound,
//     continueSession,
//     endSession,
//     submitScore,
//   } = useSocket();

//   // Helper to check if current user is the denner
//   const isCurrentUserDenner =
//     gameInfo?.hostId ===
//     gameInfo?.players.find((p) => p.name === playerName)?.id;

//   // Connect to server on component mount
//   useEffect(() => {
//     console.log(
//       "MultiplayerPartyScreen: Attempting to connect to socket server...",
//     );
//     console.log(
//       "MultiplayerPartyScreen: Current connection status:",
//       isConnected,
//     );
//     connect();
//   }, [connect]);

//   // Debug connection status changes
//   useEffect(() => {
//     console.log("MultiplayerPartyScreen: Connection status changed:", {
//       isConnected,
//       socketError,
//       currentRoom,
//     });

//     if (isConnected) {
//       console.log(
//         "MultiplayerPartyScreen: Socket connection established successfully",
//       );
//     } else {
//       console.log("MultiplayerPartyScreen: Socket is NOT connected");
//     }
//   }, [isConnected, socketError, currentRoom]);

//   // Handle socket events
//   useEffect(() => {
//     events.forEach((event) => {
//       console.log("Received socket event:", event.type, event.data);
//       switch (event.type) {
//         case "playerJoined":
//           console.log("Player joined event received:", event.data);
//           break;
//         case "roundStarted":
//           console.log("Round started event received:", event.data);
//           break;
//         case "roundFinished":
//           console.log("Round finished event received:", event.data);
//           setShowLeaderboard(true); // Automatically show leaderboard when round finishes
//           break;
//         case "sessionEnded":
//           console.log("Session ended event received:", event.data);
//           break;
//         case "error":
//           console.error("Socket error:", event.data);
//           break;
//       }
//     });
//   }, [events]);

//   const handleCreateRoom = () => {
//     if (!playerName.trim()) return;
//     createRoom(playerName.trim(), "#ff0000", {
//       maxPlayers,
//       maxRounds,
//       guessTime,
//     });
//     setShowCreateForm(false);
//   };

//   const handleJoinRoom = () => {
//     if (!playerName.trim() || !roomId.trim()) return;
//     joinRoom(roomId.trim().toUpperCase(), playerName.trim());
//     setShowJoinForm(false);
//   };

//   const handleSelectGameType = (gameType: "findColor" | "colorMixing") => {
//     if (currentRoom && isCurrentUserDenner) {
//       selectGameType(currentRoom, gameType);
//       // Immediately start the round after selecting game type
//       setTimeout(() => {
//         startRound(currentRoom);
//       }, 100); // Small delay to ensure game type is set first
//     }
//   };

//   const handleStartRound = () => {
//     if (currentRoom && isCurrentUserDenner) {
//       startRound(currentRoom);
//     }
//   };

//   const handleScoreSubmit = (score: number, timeTaken: number) => {
//     if (currentRoom) {
//       submitScore(currentRoom, score, timeTaken);
//     }
//   };

//   const getRoomShareUrl = () => {
//     if (typeof window !== "undefined" && currentRoom) {
//       return `${window.location.origin}/party?room=${currentRoom}`;
//     }
//     return "";
//   };

//   // Show connection status if not connected
//   if (!isConnected) {
//     return (
//       <div className="min-h-screen bg-[#FFFFE7] flex items-center justify-center p-4 font-mono">
//         <div className="text-center space-y-4">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
//           <p className="font-sintony text-sm text-black">
//             Connecting to server...
//           </p>
//           {socketError && (
//             <p className="font-sintony text-sm text-red-600">{socketError}</p>
//           )}
//         </div>
//       </div>
//     );
//   }

//   // Step 1: Landing screen - no room joined yet
//   if (!currentRoom && !showCreateForm && !showJoinForm) {
//     return (
//       <LandingScreen
//         onShowCreate={() => setShowCreateForm(true)}
//         onShowJoin={() => setShowJoinForm(true)}
//       />
//     );
//   }

//   // Step 2a: Create room form
//   if (showCreateForm) {
//     return (
//       <CreateRoomForm
//         playerName={playerName}
//         setPlayerName={setPlayerName}
//         maxPlayers={maxPlayers}
//         setMaxPlayers={setMaxPlayers}
//         maxRounds={maxRounds}
//         setMaxRounds={setMaxRounds}
//         guessTime={guessTime}
//         setGuessTime={setGuessTime}
//         onCreateRoom={handleCreateRoom}
//         onBack={() => setShowCreateForm(false)}
//         showQRCode={showQRCode}
//         setShowQRCode={setShowQRCode}
//       />
//     );
//   }

//   // Step 2b: Join room form
//   if (showJoinForm) {
//     return (
//       <JoinRoomForm
//         playerName={playerName}
//         setPlayerName={setPlayerName}
//         roomId={roomId}
//         setRoomId={setRoomId}
//         onJoinRoom={handleJoinRoom}
//         onBack={() => setShowJoinForm(false)}
//       />
//     );
//   }

//   // Show main game room interface
//   if (currentRoom && gameInfo) {
//     return (
//       <div className="min-h-screen bg-[#FFFFE7] p-4 font-mono">
//         <div className="w-full">
//           {/* Step 3: Lobby where denner selects game type */}
//           {gameInfo.gameState === "lobby" && (
//             <GameLobby
//               gameInfo={gameInfo}
//               isCurrentUserDenner={isCurrentUserDenner}
//               onSelectGameType={handleSelectGameType}
//               currentRoom={currentRoom}
//               showQRCode={showQRCode}
//               setShowQRCode={setShowQRCode}
//               getRoomShareUrl={getRoomShareUrl}
//             />
//           )}

//           {/* Skip Step 4: Game selection screen - auto-start after game type selection */}

//           {/* Step 4: Playing state */}
//           {gameInfo.gameState === "playing" && (
//             <div className="text-center mb-8">
//               <h1 className="font-hartone font-extralight  text-[32px] leading-[35px] text-black mb-2">
//                 Round {gameInfo.currentRound}/{gameInfo.maxRounds}
//               </h1>
//               <div className="font-sintony text-[16px] text-black mb-8">
//                 Game in Progress - Time Limit: {gameInfo.guessTime}s
//               </div>

//               {gameInfo.gameType === "findColor" && (
//                 <FindColorGame
//                   targetColor={gameInfo.targetColor}
//                   onScoreSubmit={handleScoreSubmit}
//                   timeLimit={gameInfo.guessTime}
//                 />
//               )}

//               {gameInfo.gameType === "colorMixing" && (
//                 <ColorMixingGame
//                   targetColor={gameInfo.targetColor}
//                   onScoreSubmit={handleScoreSubmit}
//                   timeLimit={gameInfo.guessTime}
//                 />
//               )}
//             </div>
//           )}

//           {/* Step 5: Round finished with modal leaderboard */}
//           {gameInfo.gameState === "roundFinished" && (
//             <div className="text-center mb-8">
//               <h1 className="font-hartone font-extralight  text-[32px] leading-[35px] text-black mb-2">
//                 Room: {currentRoom}
//               </h1>
//               <RoundFinishedScreen
//                 gameInfo={gameInfo}
//                 isCurrentUserDenner={isCurrentUserDenner}
//                 onContinueSession={() => continueSession(currentRoom)}
//                 onEndSession={() => endSession(currentRoom)}
//                 showLeaderboard={showLeaderboard}
//                 setShowLeaderboard={setShowLeaderboard}
//               />
//             </div>
//           )}

//           {/* Session finished */}
//           {gameInfo.gameState === "sessionFinished" && (
//             <div className="text-center mb-8">
//               <h1 className="font-hartone font-extralight  text-[32px] leading-[35px] text-black mb-2">
//                 Room: {currentRoom}
//               </h1>
//               <SessionFinishedScreen
//                 gameInfo={gameInfo}
//                 onLeaveRoom={() => leaveRoom()}
//               />
//             </div>
//           )}

//           {/* Leave room button */}
//           <div className="text-center mt-8">
//             <button
//               onClick={() => leaveRoom()}
//               className="font-sintony text-[14px] text-red-600 underline hover:text-red-800"
//             >
//               Leave Room
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return null;
// };
