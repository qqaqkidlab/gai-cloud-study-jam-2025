// pages/index.tsx
import { useState } from 'react';

export default function LandingPage() {
    const [profileUrl, setProfileUrl] = useState('');
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setResult(null);
        setLoading(true);

        try {
            const res = await fetch('/api/check-badges', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ profileUrl }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            setResult(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <h1>Google Cloud AI Study Jam 2025 - 生成式 AI 培訓計劃 TW<br></br> 非官方檢查進度/贈品網頁</h1>
            <p style={{color:'red'}}>活動結束於<strong>2025年10月31日 23:59 [GMT+8 台北時間]</strong>;<br></br>於2025年11月1日前，請填寫 <a href="" target="_blank" rel="noopener noreferrer">回報表格</a> 回報您的學習紀錄。活動結束後，主辦方將統一審核所有參加者的學習成果，並預計於 2025 年 11 月 30 日前寄發通知信，請您耐心等候</p>
            <h2>Check Your Google Cloud Badges 檢查您的進度與勳章 (Tiers里程碑)</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    輸入您的 Google Cloud Public Profile URL:
                    <input
                        type="url"
                        value={profileUrl}
                        placeholder="https://www.cloudskillsboost.google/public_profiles/88888888-4444-4444-aaaa-ffffffffffff"
                        onChange={(e) => setProfileUrl(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', marginTop: '10px' }}
                    />
                </label>
                <button type="submit" disabled={loading} style={{ padding: '10px 20px', marginTop: '20px', backgroundColor: loading? '#ccc' : '#dce9fc', cursor: loading ? 'not-allowed' : 'pointer'}}>
                    {loading ? 'Checking...' : 'Check Badges'} 
                </button>
                {loading && (
                    <div style={{ marginTop: '20px'}}>
                        <span>Loading...</span>
                    </div>
                )}
            </form>

                        {error && <p style={{ color: 'red' }}>{error}</p>}
            {result && (
                <div>
                    <h3>Results 結果</h3>
                    <h2><strong>Final Tier Level 最終里程碑:</strong> {result.finalTier}</h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Google Cloud Post-It <br></br>Google Cloud 便條紙 x1</th>
                                <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Google Cloud Coaster <br></br>Google Cloud 杯墊 x1</th>
                                <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Google Cloud Laptop Sleeve <br></br>Google Cloud 獨家手提筆電包 x1</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{result.tier1Complete ? '🎁' : '-'}</td>
                                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{result.tier1Complete && result.tier2Complete ? '🎁' : '-'}</td>
                                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{result.tier1Complete && result.tier2Complete && result.tier3Complete ? '🎁' : '-'}</td>
                            </tr>
                        </tbody>
                    </table>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '2px solid black', padding: '8px', textAlign: 'center' }}>Valid Skill Badges Gained<br></br>有效Skill勳章</th>
                                <th style={{ border: '2px solid black', padding: '8px', textAlign: 'center' }}>Valid Completed Badges Gained<br></br>有效Completed勳章</th>
                                <th style={{ border: '2px solid black', padding: '8px', textAlign: 'center' }}>Valid Total Badges Gained<br></br>有效勳章</th>
                                <th style={{ border: '2px solid black', padding: '8px', textAlign: 'center' }}>Old Skill Badges Gained<br></br>舊&無效Skill勳章</th>
                                <th style={{ border: '2px solid black', padding: '8px', textAlign: 'center' }}>Old Completed Badges Gained<br></br>舊&無效Completed勳章</th>
                                <th style={{ border: '2px solid black', padding: '8px', textAlign: 'center' }}>Old Total Badges Gained<br></br>舊&無效勳章</th>
                                <th style={{ border: '2px solid black', padding: '8px', textAlign: 'center' }}>Tier<br></br>贈品級別</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{result.skillBadgesCount}</td>
                                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{result.nonSkillBadgesCount}</td>
                                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{result.totalValidBadgesCount}</td>
                                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{result.oldSkillBadgesCount ? '⚠️' : ''}{result.oldSkillBadgesCount}</td>
                                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{result.oldNonSkillBadgesCount ? '⚠️' : ''}{result.oldNonSkillBadgesCount}</td>
                                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{result.totalOldBadgesCount ? '⚠️' : ''}{result.totalOldBadgesCount}</td>
                                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{result.finalTier}</td>
                            </tr>
                            
                            <tr>
                                <td style={{ border: '3px solid black', padding: '8px', textAlign: 'center' }}>
                                    Tier {result.finalTier} {result.tier1Complete && result.tier2Complete && result.tier3Complete ? ', Complete 全部完成 🎉' : ''} { !result.finalTier ? '❌' : '✅'}
                                </td>
                            </tr>
                            {result.oldSkillBadgesSet}
                            {result.oldNonSkillBadgesSet}
                            
                        </tbody>
                    </table>

                    <h3>Additions</h3>
                    <p>For more Quests, have a look at <a href="https://go.cloudskillsboost.google/arcade " target="_blank" rel="noopener noreferrer">https://go.cloudskillsboost.google/arcade</a>. </p>
                    <p>如果想參與更多GoogleCloud活動，請看 <a href="https://go.cloudskillsboost.google/arcade " target="_blank" rel="noopener noreferrer">https://go.cloudskillsboost.google/arcade</a>. </p>
                    <p>Enhance your daily life by managing your tasks with free AI-powered tool: <a href="https://tulsk.io/ " target="_blank" rel="noopener noreferrer">https://tulsk.io/</a> (no sponsorship) </p>
                    <p>使用AI工具改善每天的工作管理: <a href="https://tulsk.io/ " target="_blank" rel="noopener noreferrer">https://tulsk.io/</a> (未贊助) </p>

                </div>
            )}
            <footer style={{ marginTop: '40px', padding: '10px', textAlign: 'center', fontSize: '12px', color: 'gray' }}>
                <p>This website is unofficial. Please refer to the official website <a href="https://rsvp.withgoogle.com/events/csj-tw-2025/" target="_blank" rel="noopener noreferrer">here</a> for more information.</p>
                <p>This programs starts from 2025年10月1日 上午00:00 to 2025年10月31日 下午11:59 [GMT+8]</p>
                <p>Manage this side project by using AI powered tool: <a href="https://tulsk.io/ " target="_blank" rel="noopener noreferrer">Tulsk.io</a> </p>
            </footer>
        </div>
    );
}
