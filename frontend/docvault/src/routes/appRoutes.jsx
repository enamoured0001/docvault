import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../page/login";
import Dashboard from "../page/dashboard";
import CreateFamily from "../page/createfamily";
import AddMember from "../page/Addmember";
import Register from "../page/register";
import Home from "../page/Home";
import MemberDocuments from "../page/memberdocuments";
import Profile from "../page/Profile";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {

  return (
    <BrowserRouter>

      <Routes>

        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/create-family" element={<ProtectedRoute><CreateFamily /></ProtectedRoute>} />
        <Route path="/add-member" element={<ProtectedRoute><AddMember /></ProtectedRoute>} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route
 path="/member/:id"
 element={<MemberDocuments />}
/>

        
       

       

      </Routes>

    </BrowserRouter>
  );

}

export default AppRoutes;
