import { useOutletContext, useNavigate } from "react-router-dom";
export default function AdminLogin() {
    const navigate = useNavigate();
    const [user, setUser] = useOutletContext();
    const handleSubmit = async (e) => {
        e.preventDefault();

        const username = e.target.username.value;
        const password = e.target.password.value;

        console.log(`Username: ${username}, Password: ${password}`);

        try {
            const response = await fetch('http://localhost:3000/api/logon', 
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password})
                });
            const data = await response.json();
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
            console.log('User logged in:', user);
            if (data.role === 'manager') {
                navigate('/admin/manager');
            } else if (data.role === 'cleaner') {
                navigate('/admin/cleaner');
            }
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <div className="main">
            <div className="allForms">
                <h2>Admin Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="username" id="username" name="username" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" name="password" />
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    )
}