import {BrowserRouter,Routes,Route} from 'react-router-dom';

import ChatPage from '@/pages/ChatPage';
import FlashcardPage from '@/pages/FlashcardPage';
import QuizPage from '@/pages/QuizPage';
import Dashboard from '@/pages/Dashboard';
import LandingPage from '@/pages/LandingPage';
import UploadPage from '@/pages/UploadPage';

function AppRoutes(){
  return  (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard /> } />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/flashcards" element={<FlashcardPage />} />
        <Route path="/quiz" element={<QuizPage />} />
      </Routes>
    </BrowserRouter>  
    );
}
export default AppRoutes;