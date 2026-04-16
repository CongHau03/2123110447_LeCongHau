import { useState, useEffect } from 'react';
import './index.css';

const API_URL = 'http://localhost:5166/api'; // Standard .NET Core HTTP port; might be 5243 or similar. We should check the real port later.

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login'); // login, register, dashboard

  if (!user) {
    if (view === 'register') return <Register setView={setView} />;
    return <Login setUser={setUser} setView={setView} />;
  }

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-brand">Khách Sạn Hậu Chất Premium</div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span>Xin chào, {user.fullName}</span>
          <span className={`badge badge-${user.role.toLowerCase()}`}>{user.role}</span>
          <span style={{color: 'var(--warning)'}}>⭐ {user.points} điểm</span>
          <button onClick={() => setUser(null)} className="danger">Đăng xuất</button>
        </div>
      </nav>
      <main className="container">
        <Dashboard user={user} setUser={setUser} />
      </main>
    </div>
  );
}

function Login({ setUser, setView }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        alert('Tài khoản hoặc mật khẩu không chính xác');
      }
    } catch(e) {
      alert("Lỗi kết nối máy chủ");
    }
  };

  return (
    <div className="auth-layout" style={{backgroundImage: "url('/hotel-bg.png')"}}>
      <div className="auth-overlay">
        <div className="auth-content">
          <div className="auth-overlay-text">
            <h1>Khách Sạn Hậu Chất Premium</h1>
            <p>Khám phá không gian nghỉ dưỡng đỉnh cao, thư giãn tối đa và dịch vụ tận tâm tại hệ thống khách sạn của chúng tôi.</p>
          </div>
          <div className="auth-form-wrapper">
            <div className="auth-form-container glass-panel">
              <h2>Đăng nhập</h2>
              <p className="subtitle">Chào mừng bạn quay trở lại hệ thống</p>
              <form onSubmit={handleLogin}>
                <input type="text" placeholder="Tên đăng nhập" value={username} onChange={e => setUsername(e.target.value)} required />
                <input type="password" placeholder="Mật khẩu" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="submit" className="btn-gradient" style={{width: '100%', marginTop: '1rem'}}>Đăng nhập ngay</button>
              </form>
              <p style={{marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted)'}}>
                Chưa có tài khoản? <a href="#" onClick={() => setView('register')} style={{fontWeight: '600'}}>Đăng ký ngay</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Register({ setView }) {
  const [formData, setFormData] = useState({ username: '', password: '', fullName: '', role: 'Customer' });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        setView('login');
      } else {
        alert('Có lỗi khi đăng ký');
      }
    } catch(e) {
      alert("Lỗi kết nối máy chủ");
    }
  };

  return (
    <div className="auth-layout" style={{backgroundImage: "url('/hotel-bg.png')"}}>
      <div className="auth-overlay">
        <div className="auth-content">
          <div className="auth-overlay-text">
            <h1>Gia nhập Cùng Chúng Tôi</h1>
            <p>Trải nghiệm dịch vụ đặt phòng nhanh chóng, quy đổi điểm thưởng và nhiều ưu đãi đang chờ đợi.</p>
          </div>
          <div className="auth-form-wrapper">
            <div className="auth-form-container glass-panel">
              <h2>Tạo tài khoản</h2>
              <p className="subtitle">Chỉ mất vài giây để bắt đầu</p>
              <form onSubmit={handleRegister}>
                <input type="text" placeholder="Tên đăng nhập" onChange={e => setFormData({...formData, username: e.target.value})} required />
                <input type="password" placeholder="Mật khẩu" onChange={e => setFormData({...formData, password: e.target.value})} required />
                <input type="text" placeholder="Họ và tên" onChange={e => setFormData({...formData, fullName: e.target.value})} required />
                
  

                <button type="submit" className="btn-gradient" style={{width: '100%', marginTop: '0.5rem'}}>Đăng ký tài khoản</button>
              </form>
              <p style={{marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted)'}}>
                Đã có tài khoản? <a href="#" onClick={() => setView('login')} style={{fontWeight: '600'}}>Đăng nhập ngay</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ user, setUser }) {
  const [activeTab, setActiveTab] = useState('products');
  return (
    <div>
      <div className="dashboard-nav">
        <button onClick={() => setActiveTab('products')} className={activeTab === 'products' ? 'active' : ''}>Phòng/Dịch vụ</button>
        <button onClick={() => setActiveTab('dishes')} className={activeTab === 'dishes' ? 'active' : ''}>Ăn uống</button>
        <button onClick={() => setActiveTab('bookings')} className={activeTab === 'bookings' ? 'active' : ''}>Đặt phòng</button>
        <button onClick={() => setActiveTab('support')} className={activeTab === 'support' ? 'active' : ''}>Chăm sóc KH</button>
        <button onClick={() => setActiveTab('rewards')} className={activeTab === 'rewards' ? 'active' : ''}>Quà tặng</button>
        {(user.role === 'Admin' || user.role === 'Staff') && (
          <button onClick={() => setActiveTab('users')} className={activeTab === 'users' ? 'active' : ''}>Quản lý Người dùng</button>
        )}
      </div>

      <div className="glass-panel" style={{padding: '2rem'}}>
        {activeTab === 'products' && <Products user={user} />}
        {activeTab === 'dishes' && <Dishes user={user} />}
        {activeTab === 'bookings' && <Bookings user={user} />}
        {activeTab === 'support' && <Support user={user} />}
        {activeTab === 'rewards' && <Rewards user={user} setUser={setUser} />}
        {activeTab === 'users' && (user.role === 'Admin' || user.role === 'Staff') && <Users user={user} />}
      </div>
    </div>
  );
}

// ---- PRODUCTS ----
function Products({ user }) {
  const [products, setProducts] = useState([]);
  const [newProd, setNewProd] = useState({ name: '', description: '', price: 0, stockQuantity: 0 });

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    const res = await fetch(`${API_URL}/products`);
    if(res.ok) setProducts(await res.json());
  };

  const addProduct = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProd)
    });
    loadProducts();
  };

  const deleteProduct = async (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa phòng / dịch vụ này không?")) {
      const res = await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadProducts();
      } else {
        alert("Có lỗi xảy ra khi xóa.");
      }
    }
  };

  return (
    <div>
      <h3>Lưu trú & Dịch vụ</h3>
      {(user.role === 'Admin' || user.role === 'Staff') && (
        <form onSubmit={addProduct} style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
          <input type="text" placeholder="Tên" onChange={e => setNewProd({...newProd, name: e.target.value})} required/>
          <input type="text" placeholder="Mô tả" onChange={e => setNewProd({...newProd, description: e.target.value})} />
          <input type="number" placeholder="Giá tiền" onChange={e => setNewProd({...newProd, price: parseFloat(e.target.value)})} required/>
          <button type="submit">Thêm dịch vụ</button>
        </form>
      )}
      <div className="grid" style={{marginTop: '2rem'}}>
        {products.map(p => (
          <div key={p.id} className="card">
            <h4>{p.name}</h4>
            <p style={{color: 'var(--text-muted)'}}>{p.description}</p>
            <p style={{fontSize: '1.25rem', fontWeight: 'bold', marginTop: '1rem'}}>${p.price}</p>
            {(user.role === 'Admin' || user.role === 'Staff') && (
              <button 
                onClick={() => deleteProduct(p.id)} 
                className="danger" 
                style={{marginTop: '1rem', width: '100%'}}
              >
                Xóa phòng
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- DISHES ----
function Dishes({ user }) {
  const [dishes, setDishes] = useState([]);
  const [newDish, setNewDish] = useState({ dishName: '', description: '', price: 0, imageUrl: '', status: 'Còn hàng' });

  useEffect(() => { loadDishes(); }, []);

  const loadDishes = async () => {
    const res = await fetch(`${API_URL}/dishes`);
    if(res.ok) setDishes(await res.json());
  };

  const addDish = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/dishes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDish)
    });
    loadDishes();
  };

  const deleteDish = async (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa món này không?")) {
      const res = await fetch(`${API_URL}/dishes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadDishes();
      } else {
        alert("Có lỗi xảy ra khi xóa.");
      }
    }
  };

  return (
    <div>
      <h3>Dịch vụ Ăn uống (Nhà hàng)</h3>
      {(user.role === 'Admin' || user.role === 'Staff') && (
        <form onSubmit={addDish} style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
          <input type="text" placeholder="Tên món" onChange={e => setNewDish({...newDish, dishName: e.target.value})} required/>
          <input type="text" placeholder="Mô tả" onChange={e => setNewDish({...newDish, description: e.target.value})} />
          <input type="number" placeholder="Giá tiền" onChange={e => setNewDish({...newDish, price: parseFloat(e.target.value)})} required/>
          <input type="text" placeholder="Link hình ảnh" onChange={e => setNewDish({...newDish, imageUrl: e.target.value})} />
          <select value={newDish.status} onChange={e => setNewDish({...newDish, status: e.target.value})} style={{width: '200px'}}>
             <option value="Còn hàng">Còn hàng</option>
             <option value="Hết hàng">Hết hàng</option>
          </select>
          <button type="submit" style={{whiteSpace: 'nowrap'}}>Thêm món</button>
        </form>
      )}
      <div className="grid" style={{marginTop: '2rem'}}>
        {dishes.map(d => (
          <div key={d.dishId} className="card">
            {d.imageUrl && <img src={d.imageUrl} alt={d.dishName} style={{width: '100%', height:'200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem'}} />}
            <h4>{d.dishName} <span className={d.status === 'Còn hàng' ? 'badge badge-customer' : 'badge badge-staff'}>{d.status}</span></h4>
            <p style={{color: 'var(--text-muted)'}}>{d.description}</p>
            <p style={{fontSize: '1.25rem', fontWeight: 'bold', marginTop: '1rem'}}>${d.price}</p>
            {(user.role === 'Admin' || user.role === 'Staff') && (
              <button 
                onClick={() => deleteDish(d.dishId)} 
                className="danger" 
                style={{marginTop: '1rem', width: '100%'}}
              >
                Xóa món ăn
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- BOOKINGS ----
function Bookings({ user }) {
  const [bookings, setBookings] = useState([]);
  const [newBooking, setNewBooking] = useState({ roomId: 1, checkIn: '', checkOut: '', totalPrice: 0 });

  useEffect(() => { loadBookings(); }, []);

  const loadBookings = async () => {
    const res = await fetch(`${API_URL}/bookings1`);
    if (res.ok) setBookings(await res.json());
  };

  const addBooking = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/bookings1`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBooking)
    });
    alert("Đặt trước thành công!");
    loadBookings();
  };

  const deleteBooking = async (id) => {
    if (confirm("Xóa lịch đặt phòng này?")) {
      await fetch(`${API_URL}/bookings1/${id}`, { method: 'DELETE' });
      loadBookings();
    }
  };

  return (
    <div>
      <h3>Lịch đặt phòng</h3>
      
      <form onSubmit={addBooking} style={{display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap'}}>
        <input type="number" placeholder="Mã Phòng (Room ID)" title="Mã Phòng" onChange={e => setNewBooking({...newBooking, roomId: parseInt(e.target.value)})} required style={{width: '200px'}}/>
        <input type="datetime-local" title="Ngày nhận phòng" onChange={e => setNewBooking({...newBooking, checkIn: e.target.value})} required style={{width: '200px'}}/>
        <input type="datetime-local" title="Ngày trả phòng" onChange={e => setNewBooking({...newBooking, checkOut: e.target.value})} required style={{width: '200px'}}/>
        <input type="number" placeholder="Giá tổng (Dự kiến)" onChange={e => setNewBooking({...newBooking, totalPrice: parseFloat(e.target.value)})} required style={{width: '200px'}}/>
        <button type="submit" style={{height: 'max-content'}}>Tạo đặt phòng</button>
      </form>

      <div className="table-container" style={{marginTop: '2rem'}}>
        <table>
          <thead>
            <tr>
              <th>Mã Đặt</th>
              <th>Mã Phòng</th>
              <th>Nhận phòng</th>
              <th>Trả phòng</th>
              <th>Tổng tiền</th>
              {(user.role === 'Admin' || user.role === 'Staff') && <th>Thao tác</th>}
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.bookingId}>
                <td>{b.bookingId}</td>
                <td>{b.roomId}</td>
                <td>{new Date(b.checkIn).toLocaleString('vi-VN')}</td>
                <td>{new Date(b.checkOut).toLocaleString('vi-VN')}</td>
                <td style={{fontWeight: 'bold', color: 'var(--accent)'}}>${b.totalPrice}</td>
                {(user.role === 'Admin' || user.role === 'Staff') && (
                  <td>
                    <button className="danger" onClick={() => deleteBooking(b.bookingId)} style={{padding: '5px 10px', fontSize: '0.8rem'}}>Hủy đơn</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---- REWARDS ----
function Rewards({ user, setUser }) {
  const [rewards, setRewards] = useState([]);
  const [newRew, setNewRew] = useState({ name: '', description: '', pointsRequired: 0 });

  useEffect(() => { loadRewards(); }, []);

  const loadRewards = async () => {
    const res = await fetch(`${API_URL}/rewards`);
    if(res.ok) setRewards(await res.json());
  };

  const addReward = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/rewards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRew)
    });
    loadRewards();
  };

  const redeem = async (rewardId) => {
    const res = await fetch(`${API_URL}/rewards/redeem`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, rewardId })
    });
    const data = await res.json();
    if(res.ok) {
      alert("Đổi quà thành công!");
      setUser({...user, points: data.remainingPoints});
    } else {
      alert(data || "Lỗi khi đổi quà");
    }
  };

  return (
    <div>
      <h3>Quà tặng Tri ân</h3>
      {user.role === 'Admin' && (
        <form onSubmit={addReward} style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
          <input type="text" placeholder="Tên quà tặng" onChange={e => setNewRew({...newRew, name: e.target.value})} required/>
          <input type="text" placeholder="Mô tả" onChange={e => setNewRew({...newRew, description: e.target.value})} />
          <input type="number" placeholder="Điểm yêu cầu" onChange={e => setNewRew({...newRew, pointsRequired: parseInt(e.target.value)})} required/>
          <button type="submit">Tạo quà tặng</button>
        </form>
      )}
      <div className="grid" style={{marginTop: '2rem'}}>
        {rewards.map(r => (
          <div key={r.id} className="card">
            <h4>{r.name}</h4>
            <p style={{color: 'var(--text-muted)'}}>{r.description}</p>
            <p style={{fontSize: '1.25rem', fontWeight: 'bold', marginTop: '1rem', color: 'var(--warning)'}}>⭐ {r.pointsRequired} điểm</p>
            {user.role === 'Customer' && (
              <button onClick={() => redeem(r.id)} style={{marginTop: '1rem', width: '100%'}}>Đổi quà</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- USERS (Admin/Staff) ----
function Users({ user }) {
  const [users, setUsers] = useState([]);
  
  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    const res = await fetch(`${API_URL}/users`);
    if(res.ok) setUsers(await res.json());
  };

  const addPoints = async (id) => {
    const res = await fetch(`${API_URL}/users/${id}/add-points`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(100) // add 100 points
    });
    if(res.ok) loadUsers();
  };

  return (
    <div>
      <h3>Quản lý Nhân sự & Khách</h3>
      <div className="table-container" style={{marginTop: '2rem'}}>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Vai trò</th>
              <th>Điểm</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td style={{fontWeight: '500'}}>{u.fullName}</td>
                <td><span className={`badge badge-${u.role.toLowerCase()}`}>{u.role}</span></td>
                <td style={{fontWeight: 'bold', color: 'var(--warning)'}}>⭐ {u.points}</td>
                <td>
                  <button onClick={() => addPoints(u.id)} style={{padding: '5px 10px', fontSize: '0.8rem'}}>+100 Điểm</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---- SUPPORT ----
function Support({ user }) {
  const [tickets, setTickets] = useState([]);
  const [newTicket, setNewTicket] = useState({ customerName: user.fullName, issueDescription: '' });

  useEffect(() => { loadTickets(); }, []);

  const loadTickets = async () => {
    const res = await fetch(`${API_URL}/supporttickets`);
    if(res.ok) setTickets(await res.json());
  };

  const addTicket = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/supporttickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTicket)
    });
    setNewTicket({...newTicket, issueDescription: ''});
    alert("Yêu cầu của bạn đã được gửi. Xin cảm ơn!");
    loadTickets();
  };

  const updateStatus = async (id, status) => {
    await fetch(`${API_URL}/supporttickets/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(status)
    });
    loadTickets();
  };

  return (
    <div>
      <h3>Chăm sóc Khách hàng (Hỗ trợ)</h3>
      <form onSubmit={addTicket} style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
        <input type="text" value={newTicket.customerName} disabled style={{width: '200px'}}/>
        <input type="text" placeholder="Bạn cần hỗ trợ điều gì?" value={newTicket.issueDescription} onChange={e => setNewTicket({...newTicket, issueDescription: e.target.value})} required/>
        <button type="submit" style={{whiteSpace:'nowrap'}}>Gửi yêu cầu</button>
      </form>

      <div className="table-container" style={{marginTop: '2rem'}}>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Khách hàng</th>
              <th>Vấn đề</th>
              <th>Thời gian</th>
              <th>Trạng thái</th>
              {(user.role === 'Admin' || user.role === 'Staff') && <th>Xử lý</th>}
            </tr>
          </thead>
          <tbody>
            {tickets.map(t => (
              <tr key={t.ticketId}>
                <td>{t.ticketId}</td>
                <td style={{fontWeight: '500'}}>{t.customerName}</td>
                <td>{t.issueDescription}</td>
                <td style={{color: 'var(--text-muted)'}}>{new Date(t.createdAt).toLocaleString('vi-VN')}</td>
                <td>
                  <span className={t.status === 'Đã đóng' ? 'badge badge-admin' : t.status === 'Đang xử lý' ? 'badge badge-staff' : 'badge badge-customer'}>{t.status}</span>
                </td>
                {(user.role === 'Admin' || user.role === 'Staff') && (
                  <td style={{display: 'flex', gap: '0.5rem'}}>
                    {t.status === 'Mở' && <button className="accent" onClick={() => updateStatus(t.ticketId, 'Đang xử lý')} style={{padding: '5px 10px', fontSize: '0.8rem'}}>Tiếp nhận</button>}
                    {t.status === 'Đang xử lý' && <button onClick={() => updateStatus(t.ticketId, 'Đã đóng')} style={{padding: '5px 10px', fontSize: '0.8rem', backgroundColor: 'var(--text-muted)'}}>Đóng thẻ</button>}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
