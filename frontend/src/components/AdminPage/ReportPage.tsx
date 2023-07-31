import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList, ResponsiveContainer } from 'recharts';
import './ReportPage.css';
import { useNavigate } from 'react-router-dom';

interface ReportData {
  vacation_destination: string;
  follower_count: number;
}

interface UserData {
    userId: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
  }

const ReportPage: React.FC = () => {
  const navigate = useNavigate();
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [loggedInUser, setLoggedInUser] = useState<UserData | null>(null);


  
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token && role === 'admin') {
      fetchUserData()
        .then((userData) => {
          if (userData) {
            setLoggedInUser(userData);
          } else {
            console.error('User data is null');
            navigate('/');
          }
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          navigate('/');
        });
    } else {
      navigate('/');
    }
  }, [navigate]);

    
  const fetchUserData = async (): Promise<UserData | null> => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:3000/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch user data', error);
      return null;
    }
  };


  useEffect(() => {
    fetch('http://localhost:3000/report')
      .then(response => response.json())
      .then(data => setReportData(data))
      .catch(error => console.error('Error:', error));
  }, []);

  const handleDownloadCSV = () => {
    let csvContent = 'destination,followers\n';
    csvContent += reportData.map(vacation => `${vacation.vacation_destination},${vacation.follower_count}`).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'report.csv';
    link.click();
  };

  return (
    <div className='report-container'>
      <h1>Vacation Report</h1>
      
        <div className='chart-container'>
        <ResponsiveContainer width="100%" aspect={4/3}>
            <BarChart
                data={reportData}
            >
                <CartesianGrid strokeDasharray="5" />
                <XAxis dataKey="vacation_destination"  />
                <YAxis  />
                <Tooltip />
                <Bar dataKey="follower_count"  fill="#82bdca">
                <LabelList dataKey="follower_count" position="top" />
                </Bar>
            </BarChart>
            </ResponsiveContainer>
        </div>

        <div className='button-container'>
        <button onClick={handleDownloadCSV}>Download CSV</button>
        <button className="return-btn" onClick={() => navigate('/admin')}>
            Return
        </button>   

        </div>
    </div>
  );
};

export default ReportPage;
