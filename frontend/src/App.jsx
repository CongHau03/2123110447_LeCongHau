import { useState, useEffect } from 'react';
import './index.css';

const API_URL = 'http://localhost:5166/api'; // Standard .NET Core HTTP port; might be 5243 or similar. We should check the real port later.
const formatVND = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

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

function Modal({ title, children, onClose, onSave }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        <div className="modal-footer">
          <button className="danger" onClick={onClose}>Hủy</button>
          <button className="accent" onClick={onSave}>Lưu thay đổi</button>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ user, setUser }) {
  const [activeTab, setActiveTab] = useState('rooms');
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [newBooking, setNewBooking] = useState({ roomId: 1, checkIn: '', checkOut: '', totalPrice: 0 });
  const [foodOrders, setFoodOrders] = useState([]);

  return (
    <div>
      <div className="dashboard-nav">
        <button onClick={() => setActiveTab('rooms')} className={activeTab === 'rooms' ? 'active' : ''}>Quản lý Phòng</button>
        <button onClick={() => setActiveTab('food-orders')} className={activeTab === 'food-orders' ? 'active' : ''}>Thanh toán Đồ ăn</button>
        <button onClick={() => setActiveTab('dishes')} className={activeTab === 'dishes' ? 'active' : ''}>Ăn uống</button>
        <button onClick={() => setActiveTab('bookings')} className={activeTab === 'bookings' ? 'active' : ''}>Đặt phòng</button>
        <button onClick={() => setActiveTab('support')} className={activeTab === 'support' ? 'active' : ''}>Chăm sóc KH</button>
        <button onClick={() => setActiveTab('rewards')} className={activeTab === 'rewards' ? 'active' : ''}>Quà tặng</button>
        
        {(user.role === 'Admin' || user.role === 'Staff') && (
          <>
            <button onClick={() => setActiveTab('users')} className={activeTab === 'users' ? 'active' : ''}>Quản lý Người dùng</button>
            <button onClick={() => setActiveTab('revenue')} className={activeTab === 'revenue' ? 'active' : ''}>Quản lý Doanh thu</button>
          </>
        )}
      </div>

      <div className="glass-panel" style={{padding: '2rem'}}>
        {activeTab === 'rooms' && <Rooms user={user} setActiveTab={setActiveTab} setNewBooking={setNewBooking} />}
        {activeTab === 'food-orders' && <FoodOrders user={user} foodOrders={foodOrders} setFoodOrders={setFoodOrders} />}
        {activeTab === 'dishes' && <Dishes user={user} foodOrders={foodOrders} setFoodOrders={setFoodOrders} />}
        {activeTab === 'bookings' && <Bookings user={user} newBooking={newBooking} setNewBooking={setNewBooking} />}
        {activeTab === 'support' && <Support user={user} />}
        {activeTab === 'rewards' && <Rewards user={user} setUser={setUser} />}
        {activeTab === 'users' && (user.role === 'Admin' || user.role === 'Staff') && <Users user={user} />}
        {activeTab === 'revenue' && (user.role === 'Admin' || user.role === 'Staff') && <Revenue />}
      </div>
    </div>
  );
}

// ---- FOOD ORDERS (BILLING) ----
function FoodOrders({ user, foodOrders, setFoodOrders }) {
  const total = foodOrders.reduce((sum, item) => sum + item.price, 0);

  const removeOrder = (id) => {
    setFoodOrders(foodOrders.filter(o => o.id !== id));
  };

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
        <h3>Chi tiết Thanh toán Đồ ăn & Thức uống</h3>
        <div className="card" style={{padding: '1rem 2rem', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--accent)'}}>
          <p style={{fontSize: '0.9rem', color: 'var(--text-muted)'}}>Tổng cộng cần thanh toán:</p>
          <h2 style={{color: 'var(--accent)'}}>{formatVND(total)}</h2>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Thời gian</th>
              <th>Tên món ăn/đồ uống</th>
              <th>Đơn giá</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {foodOrders.map(order => (
              <tr key={order.id}>
                <td>{order.time}</td>
                <td style={{fontWeight: '500'}}>{order.name}</td>
                <td style={{color: 'var(--accent)', fontWeight: 'bold'}}>{formatVND(order.price)}</td>
                <td>
                  <button className="danger" onClick={() => removeOrder(order.id)} style={{padding: '5px 10px', fontSize: '0.8rem'}}>Hủy món</button>
                </td>
              </tr>
            ))}
            {foodOrders.length === 0 && (
              <tr>
                <td colSpan="4" style={{textAlign: 'center', padding: '3rem', color: 'var(--text-muted)'}}>
                  Chưa có món ăn nào được đặt. Hãy qua tab "Ăn uống" để chọn món!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {foodOrders.length > 0 && (
        <div style={{marginTop: '2rem', display: 'flex', justifyContent: 'flex-end'}}>
          <button className="btn-gradient" onClick={async () => {
            const res = await fetch(`${API_URL}/transactions`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ description: `Thanh toán Đồ ăn (${foodOrders.length} món)`, amount: total })
            });
            if (res.ok) {
              alert("Thanh toán thành công! Tiền đã được cộng vào doanh thu.");
              setFoodOrders([]);
            }
          }}>
            Xác nhận Thanh toán
          </button>
        </div>
      )}
    </div>
  );
}

// ---- DISHES ----
function Dishes({ user, foodOrders, setFoodOrders }) {
  const [dishes, setDishes] = useState([]);
  const [newDish, setNewDish] = useState({ dishName: '', description: '', price: 0, imageUrl: '', status: 'Còn hàng' });
  const [editingDish, setEditingDish] = useState(null);

  useEffect(() => { loadDishes(); }, []);

  const loadDishes = async () => {
    const res = await fetch(`${API_URL}/dishes`);
    if(res.ok) setDishes(await res.json());
  };

  const addDish = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/dishes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDish)
    });
    if (res.ok) {
      alert("Đã thêm món mới!");
      setNewDish({ dishName: '', description: '', price: 0, imageUrl: '', status: 'Còn hàng' });
      loadDishes();
    }
  };

  const updateDish = async () => {
    const res = await fetch(`${API_URL}/dishes/${editingDish.dishId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingDish)
    });
    if (res.ok) {
      alert("Cập nhật thành công!");
      setEditingDish(null);
      loadDishes();
    }
  };

  const deleteDish = async (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa món này không?")) {
      const res = await fetch(`${API_URL}/dishes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert("Đã xóa!");
        loadDishes();
      } else {
        alert("Có lỗi xảy ra khi xóa.");
      }
    }
  };

  const orderDish = (dish) => {
    const newOrder = { 
      id: Date.now(), 
      name: dish.dishName, 
      price: dish.price, 
      time: new Date().toLocaleTimeString('vi-VN') 
    };
    setFoodOrders([...foodOrders, newOrder]);
    alert(`Đã đặt món: ${dish.dishName}. Bạn có thể kiểm tra hóa đơn tại tab "Thanh toán Đồ ăn"!`);
  };

  return (
    <div>
      <h3>Dịch vụ Ăn uống (Nhà hàng)</h3>
      {(user.role === 'Admin' || user.role === 'Staff') && (
        <form onSubmit={addDish} className="crud-form">
          <input type="text" placeholder="Tên món" value={newDish.dishName} onChange={e => setNewDish({...newDish, dishName: e.target.value})} required/>
          <input type="text" placeholder="Mô tả" value={newDish.description} onChange={e => setNewDish({...newDish, description: e.target.value})} />
          <input type="number" placeholder="Giá tiền (VNĐ)" value={newDish.price} onChange={e => setNewDish({...newDish, price: parseFloat(e.target.value)})} required/>
          <input type="text" placeholder="Link hình ảnh" value={newDish.imageUrl} onChange={e => setNewDish({...newDish, imageUrl: e.target.value})} />
          <select value={newDish.status} onChange={e => setNewDish({...newDish, status: e.target.value})} style={{width: '200px'}}>
             <option value="Còn hàng">Còn hàng</option>
             <option value="Hết hàng">Hết hàng</option>
          </select>
          <button type="submit" className="btn-gradient">Thêm món</button>
        </form>
      )}
      <div className="grid" style={{marginTop: '2rem'}}>
        {dishes.map(d => (
          <div key={d.dishId} className="card">
            {d.imageUrl && <img src={d.imageUrl} alt={d.dishName} style={{width: '100%', height:'200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem'}} />}
            <h4>{d.dishName} <span className={d.status === 'Còn hàng' ? 'badge badge-customer' : 'badge badge-staff'}>{d.status}</span></h4>
            <p style={{color: 'var(--text-muted)'}}>{d.description}</p>
            <p style={{fontSize: '1.25rem', fontWeight: 'bold', marginTop: '1rem'}}>{formatVND(d.price)}</p>
            
            <div style={{display: 'flex', gap: '0.5rem', marginTop: '1rem'}}>
              <button onClick={() => orderDish(d)} className="btn-gradient" style={{flex: 1}}>Đặt ngay</button>
              {(user.role === 'Admin' || user.role === 'Staff') && (
                <>
                  <button onClick={() => setEditingDish(d)} className="accent" style={{padding: '10px'}}>Sửa</button>
                  <button onClick={() => deleteDish(d.dishId)} className="danger" style={{padding: '10px'}}>Xóa</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {editingDish && (
        <Modal title="Sửa thông tin Món ăn" onClose={() => setEditingDish(null)} onSave={updateDish}>
          <input type="text" placeholder="Tên món" value={editingDish.dishName} onChange={e => setEditingDish({...editingDish, dishName: e.target.value})} />
          <input type="text" placeholder="Mô tả" value={editingDish.description} onChange={e => setEditingDish({...editingDish, description: e.target.value})} />
          <input type="number" placeholder="Giá tiền (VNĐ)" value={editingDish.price} onChange={e => setEditingDish({...editingDish, price: parseFloat(e.target.value)})} />
          <input type="text" placeholder="Link hình ảnh" value={editingDish.imageUrl} onChange={e => setEditingDish({...editingDish, imageUrl: e.target.value})} />
          <select value={editingDish.status} onChange={e => setEditingDish({...editingDish, status: e.target.value})}>
             <option value="Còn hàng">Còn hàng</option>
             <option value="Hết hàng">Hết hàng</option>
          </select>
        </Modal>
      )}
    </div>
  );
}

// ---- BOOKINGS ----
function Bookings({ user, newBooking, setNewBooking }) {
  const [bookings, setBookings] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);

  useEffect(() => { loadBookings(); }, []);

  const loadBookings = async () => {
    const res = await fetch(`${API_URL}/bookings1`);
    if (res.ok) setBookings(await res.json());
  };

  const addBooking = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/bookings1`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBooking)
    });
    if (res.ok) {
      alert("Đặt phòng thành công!");
      setNewBooking({ roomId: 1, checkIn: '', checkOut: '', totalPrice: 0 });
      loadBookings();
    }
  };

  const updateBooking = async () => {
    const res = await fetch(`${API_URL}/bookings1/${editingBooking.bookingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingBooking)
    });
    if (res.ok) {
      alert("Cập nhật đơn đặt thành công!");
      setEditingBooking(null);
      loadBookings();
    }
  };

  const updateBookingStatus = async (booking, status) => {
    const updated = { ...booking, status };
    const res = await fetch(`${API_URL}/bookings1/${booking.bookingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });
    if (res.ok) {
      alert(`Đã chuyển trạng thái sang: ${status}`);
      loadBookings();
    }
  };

  const deleteBooking = async (id) => {
    if (confirm("Xóa lịch đặt phòng này?")) {
      await fetch(`${API_URL}/bookings1/${id}`, { method: 'DELETE' });
      alert("Đã hủy đơn!");
      loadBookings();
    }
  };

  return (
    <div>
      <h3>Lịch đặt phòng</h3>
      
      <form onSubmit={addBooking} className="crud-form">
        <input type="number" placeholder="Mã Phòng" title="Mã Phòng" value={newBooking.roomId} onChange={e => setNewBooking({...newBooking, roomId: parseInt(e.target.value)})} required />
        <input type="datetime-local" title="Ngày nhận phòng" value={newBooking.checkIn} onChange={e => setNewBooking({...newBooking, checkIn: e.target.value})} required />
        <input type="datetime-local" title="Ngày trả phòng" value={newBooking.checkOut} onChange={e => setNewBooking({...newBooking, checkOut: e.target.value})} required />
        <input type="number" placeholder="Giá tổng (VNĐ)" value={newBooking.totalPrice} onChange={e => setNewBooking({...newBooking, totalPrice: parseFloat(e.target.value)})} required />
        <button type="submit" className="btn-gradient">Tạo đặt phòng</button>
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
              <th>Trạng thái</th>
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
                <td style={{fontWeight: 'bold', color: 'var(--accent)'}}>{formatVND(b.totalPrice)}</td>
                <td>
                  <span className={`badge ${b.status === 'Đã duyệt' ? 'badge-customer' : b.status === 'Chờ duyệt' ? 'badge-staff' : 'badge-admin'}`}>
                    {b.status || 'Chờ duyệt'}
                  </span>
                </td>
                {(user.role === 'Admin' || user.role === 'Staff') && (
                  <td>
                    <div style={{display: 'flex', gap: '0.5rem'}}>
                      {b.status !== 'Đã duyệt' && (
                        <button className="accent" onClick={() => updateBookingStatus(b, 'Đã duyệt')} style={{padding: '5px 10px', fontSize: '0.8rem'}}>Duyệt</button>
                      )}
                      <button className="accent" onClick={() => setEditingBooking(b)} style={{padding: '5px 10px', fontSize: '0.8rem'}}>Sửa</button>
                      <button className="danger" onClick={() => deleteBooking(b.bookingId)} style={{padding: '5px 10px', fontSize: '0.8rem'}}>Hủy đơn</button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingBooking && (
        <Modal title="Cập nhật Đặt phòng" onClose={() => setEditingBooking(null)} onSave={updateBooking}>
          <label>Mã Phòng</label>
          <input type="number" value={editingBooking.roomId} onChange={e => setEditingBooking({...editingBooking, roomId: parseInt(e.target.value)})} />
          <label>Ngày nhận</label>
          <input type="datetime-local" value={editingBooking.checkIn} onChange={e => setEditingBooking({...editingBooking, checkIn: e.target.value})} />
          <label>Ngày trả</label>
          <input type="datetime-local" value={editingBooking.checkOut} onChange={e => setEditingBooking({...editingBooking, checkOut: e.target.value})} />
          <label>Tổng tiền (VNĐ)</label>
          <input type="number" value={editingBooking.totalPrice} onChange={e => setEditingBooking({...editingBooking, totalPrice: parseFloat(e.target.value)})} />
        </Modal>
      )}
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

// ---- REVENUE MANAGEMENT ----
function Revenue() {
  const [stats, setStats] = useState({ totalRevenue: 0, totalBookings: 0, avgRevenue: 0 });
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const resB = await fetch(`${API_URL}/bookings1`);
      const resT = await fetch(`${API_URL}/transactions`);
      
      let allBookings = [];
      let allTransactions = [];

      if (resB.ok) allBookings = await resB.json();
      if (resT.ok) allTransactions = await resT.json();

      const bookingRevenue = allBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
      const transRevenue = allTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
      const totalRevenue = bookingRevenue + transRevenue;
      
      setStats({
        totalRevenue: totalRevenue,
        totalBookings: allBookings.length,
        avgRevenue: allBookings.length > 0 ? totalRevenue / allBookings.length : 0
      });

      // Grouping by month logic
      const monthlyMap = {};
      allBookings.forEach(b => {
        if (b.checkIn) {
          const date = new Date(b.checkIn);
          const month = `${date.getMonth() + 1}/${date.getFullYear()}`;
          monthlyMap[month] = (monthlyMap[month] || 0) + (b.totalPrice || 0);
        }
      });
      allTransactions.forEach(t => {
        if (t.createdAt) {
          const date = new Date(t.createdAt);
          const month = `${date.getMonth() + 1}/${date.getFullYear()}`;
          monthlyMap[month] = (monthlyMap[month] || 0) + (t.amount || 0);
        }
      });

      setMonthlyData(Object.entries(monthlyMap).map(([month, total]) => ({ month, total })));
    } catch (err) {
      console.error("Revenue load error:", err);
    }
  };

  return (
    <div>
      <h3 style={{marginBottom: '2rem'}}>Thống kê Doanh thu & Kinh doanh</h3>
      
      <div className="grid">
        <div className="card" style={{borderLeft: '4px solid var(--accent)'}}>
          <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase'}}>Tổng doanh thu</p>
          <h2 style={{color: 'var(--accent)', marginTop: '0.5rem'}}>{formatVND(stats.totalRevenue)}</h2>
        </div>
        <div className="card" style={{borderLeft: '4px solid var(--primary)'}}>
          <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase'}}>Tổng lượt đặt phòng</p>
          <h2 style={{marginTop: '0.5rem'}}>{stats.totalBookings} đơn hàng</h2>
        </div>
        <div className="card" style={{borderLeft: '4px solid var(--warning)'}}>
          <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase'}}>Doanh thu trung bình / đơn phòng</p>
          <h2 style={{color: 'var(--warning)', marginTop: '0.5rem'}}>{formatVND(stats.avgRevenue)}</h2>
        </div>
      </div>

      <div style={{marginTop: '3rem'}}>
        <h4>Chi tiết doanh thu theo tháng (Phòng + Đồ ăn)</h4>
        <div className="table-container" style={{marginTop: '1rem'}}>
          <table>
            <thead>
              <tr>
                <th>Tháng / Năm</th>
                <th>Doanh thu</th>
                <th>Tỷ lệ</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map(item => (
                <tr key={item.month}>
                  <td>Tháng {item.month}</td>
                  <td style={{fontWeight: 'bold', color: 'var(--accent)'}}>{formatVND(item.total)}</td>
                  <td>{((item.total / (stats.totalRevenue || 1)) * 100).toFixed(1)}%</td>
                </tr>
              ))}
              {monthlyData.length === 0 && (
                <tr>
                  <td colSpan="3" style={{textAlign: 'center', padding: '2rem'}}>Chưa có dữ liệu doanh thu.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ---- ROOMS MANAGEMENT ----
function Rooms({ user, setActiveTab, setNewBooking }) {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState({ roomName: '', roomType: '', price: 0, status: 'Trống' });
  const [editingRoom, setEditingRoom] = useState(null);

  useEffect(() => { loadRooms(); }, []);

  const loadRooms = async () => {
    const res = await fetch(`${API_URL}/rooms1`);
    if(res.ok) setRooms(await res.json());
  };

  const addRoom = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/rooms1`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRoom)
    });
    if (res.ok) {
      alert("Thêm phòng thành công!");
      setNewRoom({ roomName: '', roomType: '', price: 0, status: 'Trống' });
      loadRooms();
    }
  };

  const updateRoom = async () => {
    const res = await fetch(`${API_URL}/rooms1/${editingRoom.roomId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingRoom)
    });
    if (res.ok) {
      alert("Cập nhật phòng thành công!");
      setEditingRoom(null);
      loadRooms();
    }
  };

  const deleteRoom = async (id) => {
    if (confirm("Xóa phòng này?")) {
      const res = await fetch(`${API_URL}/rooms1/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert("Đã xóa!");
        loadRooms();
      }
    }
  };

  const startBooking = (room) => {
    setNewBooking({ roomId: room.roomId, checkIn: '', checkOut: '', totalPrice: room.price });
    setActiveTab('bookings');
  };

  return (
    <div>
      <h3>Quản lý Hệ thống Phòng</h3>
      
      {(user.role === 'Admin' || user.role === 'Staff') && (
        <form onSubmit={addRoom} className="crud-form">
          <input type="text" placeholder="Số phòng" value={newRoom.roomName} onChange={e => setNewRoom({...newRoom, roomName: e.target.value})} required/>
          <input type="text" placeholder="Loại phòng" value={newRoom.roomType} onChange={e => setNewRoom({...newRoom, roomType: e.target.value})} />
          <input type="number" placeholder="Giá/Đêm (VNĐ)" value={newRoom.price} onChange={e => setNewRoom({...newRoom, price: parseFloat(e.target.value)})} required/>
          <select value={newRoom.status} onChange={e => setNewRoom({...newRoom, status: e.target.value})}>
            <option value="Trống">Trống</option>
            <option value="Đã đặt">Đã đặt</option>
            <option value="Đang dọn">Đang dọn</option>
          </select>
          <button type="submit" className="btn-gradient">Thêm phòng</button>
        </form>
      )}

      <div className="grid" style={{marginTop: '2rem'}}>
        {rooms.map(r => (
          <div key={r.roomId} className="card">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
              <h4>Phòng {r.roomName}</h4>
              <span className={`badge ${r.status.toLowerCase().includes('trống') ? 'badge-customer' : r.status.toLowerCase().includes('đặt') ? 'badge-admin' : 'badge-staff'}`}>
                {r.status}
              </span>
            </div>
            <p style={{color: 'var(--text-muted)'}}>{r.roomType}</p>
            <p style={{fontSize: '1.25rem', fontWeight: 'bold', marginTop: '1rem'}}>{formatVND(r.price)}/đêm</p>
            
            <div style={{display: 'flex', gap: '0.5rem', marginTop: '1rem'}}>
              {r.status.toLowerCase().includes('trống') && (
                <button onClick={() => startBooking(r)} style={{flex: 1}} className="btn-gradient">Đặt ngay</button>
              )}
              {(user.role === 'Admin' || user.role === 'Staff') && (
                <>
                  <button onClick={() => setEditingRoom(r)} className="accent" style={{padding: '10px'}}>Sửa</button>
                  <button onClick={() => deleteRoom(r.roomId)} className="danger" style={{padding: '10px'}}>Xóa</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {editingRoom && (
        <Modal title="Sửa thông tin Phòng" onClose={() => setEditingRoom(null)} onSave={updateRoom}>
          <label>Số phòng</label>
          <input type="text" value={editingRoom.roomName} onChange={e => setEditingRoom({...editingRoom, roomName: e.target.value})} />
          <label>Loại phòng</label>
          <input type="text" value={editingRoom.roomType} onChange={e => setEditingRoom({...editingRoom, roomType: e.target.value})} />
          <label>Giá/Đêm (VNĐ)</label>
          <input type="number" value={editingRoom.price} onChange={e => setEditingRoom({...editingRoom, price: parseFloat(e.target.value)})} />
          <label>Trạng thái</label>
          <select value={editingRoom.status} onChange={e => setEditingRoom({...editingRoom, status: e.target.value})}>
            <option value="Trống">Trống</option>
            <option value="Đã đặt">Đã đặt</option>
            <option value="Đang dọn">Đang dọn</option>
          </select>
        </Modal>
      )}
    </div>
  );
}
