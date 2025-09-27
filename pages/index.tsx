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
            <h1>Google Cloud AI Study Jam 2024 - 生成式 AI 培訓計劃 TW<br></br> 非官方檢查進度/贈品網頁</h1>
            <p style={{color:'red'}}>活動結束於<strong>2024年11月3日 23:59 [GMT+8 台北時間]</strong>;<br></br>於2024年11月15日前，請填寫 <a href="https://forms.gle/H8gN6eWoGMPqXpB86" target="_blank" rel="noopener noreferrer">回報表格</a> 回報您的學習紀錄。</p>
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
                                <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Google Cloud Sticker <br></br>Google Cloud 貼紙 x1</th>
                                <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Google Cloud Thermos Cup <br></br>Google Cloud 不鏽鋼保溫杯 x1</th>
                                <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>Google Cloud Bag <br></br>Google Cloud獨家後背包 x1</th>
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
                                <th style={{ border: '2px solid black', padding: '8px', textAlign: 'center' }}>Path<br></br>學習路徑</th>
                                <th style={{ border: '2px solid black', padding: '8px', textAlign: 'center' }}>Valid Badges Gained<br></br>有效勳章</th>
                                <th style={{ border: '2px solid black', padding: '8px', textAlign: 'center' }}>Old Badges Gained<br></br>舊&無效勳章</th>
                                <th style={{ border: '2px solid black', padding: '8px', textAlign: 'center' }}>Path Completed<br></br>路徑完成度</th>
                                <th style={{ border: '2px solid black', padding: '8px', textAlign: 'center' }}>Tier<br></br>贈品級別</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}> <a href="https://www.cloudskillsboost.google/paths/118" target="_blank" rel="noopener noreferrer">Path 1</a> </td>
                                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{result.tier1BadgesCount}/{result.totalTier1Badges}</td>
                                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{result.old1BadgesCount ? '⚠️' : ''}{result.old1BadgesCount}/{result.totalTier1Badges}</td>
                                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{(result.tier1BadgesCount + result.old1BadgesCount) === result.totalTier1Badges ? '✅ Complete 已完成' : '❌ Incomplete 未完成'}</td>
                                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>
                                    {(result.tier1Complete && (result.old1BadgesCount === 0)) ? 'Tier1 ✅' : '❌ Incomplete 未完成'}
                                    {!result.old1BadgesCount ? '' : '\n❌ Disqualified 不符合資格'}
                                </td>
                            </tr>
                            <tr>
                                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}> <a href="https://www.cloudskillsboost.google/paths/236" target="_blank" rel="noopener noreferrer">Path 2</a> </td>
                                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{result.tier2BadgesCount}/{result.totalTier2Badges}</td>
                                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{result.old2BadgesCount ? '⚠️' : ''}{result.old2BadgesCount}/{result.totalTier2Badges}</td>
                                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{(result.tier2BadgesCount + result.old2BadgesCount) === result.totalTier2Badges ? '✅ Complete 已完成' : '❌ Incomplete 未完成'}</td>
                                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>
                                    {(result.tier1Complete && result.tier2Complete && (result.old1BadgesCount === 0) && (result.old2BadgesCount === 0)) ? 'Tier2 ✅' : '❌ Incomplete 未完成'}
                                    {(!result.old1BadgesCount && !result.old2BadgesCount) ? '' : '\n❌ Disqualified 不符合資格'}
                                </td>
                            </tr>
                            <tr>
                                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}> <a href="https://www.cloudskillsboost.google/paths/183" target="_blank" rel="noopener noreferrer">Path 3</a> </td>
                                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{result.tier3BadgesCount}/{result.totalTier3Badges}</td>
                                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{result.old3BadgesCount ? '⚠️' : ''}{result.old3BadgesCount}/{result.totalTier3Badges}</td>
                                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{(result.tier3BadgesCount + result.old3BadgesCount) === result.totalTier3Badges ? '✅ Complete 已完成' : '❌ Incomplete 未完成'}</td>
                                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>
                                    {(result.tier1Complete && result.tier2Complete && result.tier3Complete && (result.old1BadgesCount === 0) && (result.old2BadgesCount === 0)) && (result.old3BadgesCount === 0) ? 'Tier3 ✅' : '❌ Incomplete 未完成'}
                                    {(!result.old1BadgesCount && !result.old2BadgesCount && !result.old3BadgesCount) ? '' : '❌ Disqualified 不符合資格'}
                                </td>
                            </tr>
                            <tr>
                                <td style={{ border: '3px solid black', padding: '8px', textAlign: 'center' }}>Summary</td>
                                <td style={{ border: '3px solid black', padding: '8px', textAlign: 'center' }}>{result.tier1BadgesCount + result.tier2BadgesCount + result.tier3BadgesCount}/{result.totalTier1Badges + result.totalTier2Badges + result.totalTier3Badges}</td>
                                <td style={{ border: '3px solid black', padding: '8px', textAlign: 'center' }}>{result.old1BadgesCount + result.old2BadgesCount + result.old3BadgesCount}/{result.totalTier1Badges + result.totalTier2Badges + result.totalTier3Badges}</td>
                                <td style={{ border: '3px solid black', padding: '8px', textAlign: 'center' }}> - </td>
                                <td style={{ border: '3px solid black', padding: '8px', textAlign: 'center' }}>
                                    Tier {result.finalTier} {result.tier1Complete && result.tier2Complete && result.tier3Complete ? ', Complete 全部完成 🎉' : ''} { !result.finalTier ? '❌' : '✅'}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <h3><strong>You get 你得到: {result.finalTier ? "": "無贈品 Nothing..."}</strong></h3>
                    <p>{result.tier1Complete ? '\"Google Cloud Sticker 貼紙\" x1' : ""}</p>
                    <p>{result.tier1Complete && result.tier2Complete ? '\"Google Cloud Thermos Cup 不鏽鋼保溫杯\" x1' : ""}</p>
                    <p>{result.tier1Complete && result.tier2Complete && result.tier3Complete ? '\"Google Cloud Bag 獨家後背包\" x1' : ""}</p>
                    <p>{result.tier1Complete && result.tier2Complete && result.tier3Complete ? 'Congrats, you have completed all the paths and got all the swags. 恭喜您完成所有學習課程並獲得所有贈品🎁' : 'Keep fighting 繼續加油!!'}</p>
                    <p>Please fill out the <a href="https://forms.gle/H8gN6eWoGMPqXpB86" target="_blank" rel="noopener noreferrer">FORM</a> to submit your quest once you complete all the paths before 2024/NOV/15th to gain the swags.</p>
                    <p style={{color:'red'}}>於2024年11月15日前，請填寫 <a href="https://forms.gle/H8gN6eWoGMPqXpB86" target="_blank" rel="noopener noreferrer">回報表格</a> 回報您的學習紀錄。</p>
                    <p>------------------------------------------------------------</p>
                    <h3>FAQ</h3>
                        <p>Q0: 參與活動開始前需要留意什麼事項呢？</p>
                        <p>A0: 您需要有充足的時間投入學習，一台能上網的電腦，以及有排除各種障礙的衝勁。同時請確保您是否擁有舊勳章影響贈品資格。（disclaimer: 一切最終辦法由活動主辦方為準）。舊勳章不影響學習資格，詳見Q1、Q2。</p>

                        <p>Q1: 我發現我已經在活動期間外取得勳章，是否影響參與活動？</p>
                        <p>A1: 擁有舊勳章可以繼續學習，但會無法取得活動指定學習路徑的贈品。例如您的舊勳章在path 1則完全無法取得任何贈品；同理以此類推各path的資格，詳見活動官網。</p>

                        <p>Q2: 我有舊勳章，但我也想取得贈品怎麼辦？</p>
                        <p>A2: 建議開通一組新帳號參與活動。</p>
                    <p>------------------------------------------------------------</p>
                    <h3>Details 相關細節</h3>
                    <p>------------------------------------------------------------</p>
                    <p>Total Valid Badges Gained 有效勳章🎖️: {result.totalBadgesGained}</p>
                    <p>Badges gained after the end time 活動結束後獲得的勳章/無效勳章🎖️: {result.outOfRangeCount}</p>
                    <p>Old Badges Count 舊勳章/無效勳章🎖️: {result.oldBadgesCount}, <br></br>{result.oldBadgesCount ? '❌❌❌[Important] Seems like you have old badge(s), please read the instructions before starting the process... 您有無效勳章，會影響贈品資格，請詳閱活動規則再開始。。。❌❌❌' : 'Looks good, no need to worry on checking Tier Validation. 沒有無效勳章，很棒'}</p>
                    
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '2px solid black', padding: '8px', textAlign: 'center' }}>Path<br></br>學習路徑</th>
                                <th style={{ border: '2px solid black', padding: '8px', textAlign: 'center' }}>Valid Badges Gained<br></br>有效勳章</th>
                                <th style={{ border: '2px solid black', padding: '8px', textAlign: 'center' }}>Old Badges Gained<br></br>舊&無效勳章</th>
                                <th style={{ border: '2px solid black', padding: '8px', textAlign: 'center' }}>Path Completed<br></br>路徑完成度</th>
                                <th style={{ border: '2px solid black', padding: '8px', textAlign: 'center' }}>Tier<br></br>贈品級別</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}> <a href="https://www.cloudskillsboost.google/paths/118" target="_blank" rel="noopener noreferrer">Path 1</a> </td>
                                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{result.tier1BadgesCount}/{result.totalTier1Badges}</td>
                                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{result.old1BadgesCount}/{result.totalTier1Badges}</td>
                                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{(result.tier1BadgesCount + result.old1BadgesCount) === result.totalTier1Badges ? '✅ Complete 已完成' : '❌ Incomplete 未完成'}</td>
                                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>
                                    {(result.tier1Complete && (result.old1BadgesCount === 0)) ? 'Tier1 ✅' : '❌ Incomplete 未完成'}
                                    {!result.old1BadgesCount ? '' : '\n❌ Disqualified 不符合資格'}
                                </td>
                            </tr>
                            <tr>
                                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}> <a href="https://www.cloudskillsboost.google/paths/236" target="_blank" rel="noopener noreferrer">Path 2</a> </td>
                                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{result.tier2BadgesCount}/{result.totalTier2Badges}</td>
                                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{result.old2BadgesCount}/{result.totalTier2Badges}</td>
                                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{(result.tier2BadgesCount + result.old2BadgesCount) === result.totalTier2Badges ? '✅ Complete 已完成' : '❌ Incomplete 未完成'}</td>
                                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>
                                    {(result.tier1Complete && result.tier2Complete && (result.old1BadgesCount === 0) && (result.old2BadgesCount === 0)) ? 'Tier2 ✅' : '❌ Incomplete 未完成'}
                                    {(!result.old1BadgesCount && !result.old2BadgesCount) ? '' : '\n❌ Disqualified 不符合資格'}
                                </td>
                            </tr>
                            <tr>
                                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}> <a href="https://www.cloudskillsboost.google/paths/183" target="_blank" rel="noopener noreferrer">Path 3</a> </td>
                                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{result.tier3BadgesCount}/{result.totalTier3Badges}</td>
                                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{result.old3BadgesCount}/{result.totalTier3Badges}</td>
                                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{(result.tier3BadgesCount + result.old3BadgesCount) === result.totalTier3Badges ? '✅ Complete 已完成' : '❌ Incomplete 未完成'}</td>
                                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>
                                    {(result.tier1Complete && result.tier2Complete && result.tier3Complete && (result.old1BadgesCount === 0) && (result.old2BadgesCount === 0)) && (result.old3BadgesCount === 0) ? 'Tier3 ✅' : '❌ Incomplete 未完成'}
                                    {(!result.old1BadgesCount && !result.old2BadgesCount && !result.old3BadgesCount) ? '' : '❌ Disqualified 不符合資格'}
                                </td>
                            </tr>
                            <tr>
                                <td style={{ border: '3px solid black', padding: '8px', textAlign: 'center' }}>Summary</td>
                                <td style={{ border: '3px solid black', padding: '8px', textAlign: 'center' }}>{result.tier1BadgesCount + result.tier2BadgesCount + result.tier3BadgesCount}/{result.totalTier1Badges + result.totalTier2Badges + result.totalTier3Badges}</td>
                                <td style={{ border: '3px solid black', padding: '8px', textAlign: 'center' }}>{result.old1BadgesCount + result.old2BadgesCount + result.old3BadgesCount}/{result.totalTier1Badges + result.totalTier2Badges + result.totalTier3Badges}</td>
                                <td style={{ border: '3px solid black', padding: '8px', textAlign: 'center' }}> - </td>
                                <td style={{ border: '3px solid black', padding: '8px', textAlign: 'center' }}>
                                    Tier {result.finalTier} {result.tier1Complete && result.tier2Complete && result.tier3Complete ? ', Complete 全部完成 🎉' : ''} { !result.finalTier ? '❌' : '✅'}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <p>Tier 1 : {result.old1BadgesCount ? "Found Old Badges: " + result.old1BadgesCount +'/'+ result.totalTier1Badges + "; You have lost the journey, please create a new account if you want to redeem the swags.": ''}<br></br> - status for "Google Cloud Sticker" x1 : {result.tier1Complete ? '✅' : '❌ Path 1 is not valid or not complete yet.'}</p>
                    <p>Tier 2 : {result.old2BadgesCount ? "Found Old Badges: " + result.old2BadgesCount+'/'+result.totalTier2Badges : ''}<br></br> - status for "Google Cloud Sticker" x1 + "Google Cloud Thermos Cup" x1 : {result.tier1Complete && result.tier2Complete ? '✅' : '❌ Path 1 is not valid or Path 2 is not complete yet.'}</p>
                    <p>Tier 3 : {result.old3BadgesCount ? "Found Old Badges: " + result.old3BadgesCount+'/'+result.totalTier3Badges : ''}<br></br> - status for "Google Cloud Sticker" x1 + "Google Cloud Thermos Cup" x1 + "Google Cloud Bag" x1 : {result.tier1Complete && result.tier2Complete && result.tier3Complete ? '✅' : '❌ Path 1 or 2 is not valid or Path 3 is not complete yet.'}</p>
                    <h3>Additions</h3>
                    <p>For more Quests, have a look at <a href="https://go.cloudskillsboost.google/arcade " target="_blank" rel="noopener noreferrer">https://go.cloudskillsboost.google/arcade</a>. </p>
                    <p>如果想參與更多GoogleCloud活動，請看 <a href="https://go.cloudskillsboost.google/arcade " target="_blank" rel="noopener noreferrer">https://go.cloudskillsboost.google/arcade</a>. </p>
                    <p>Enhance your daily life by managing your tasks with free AI-powered tool: <a href="https://tulsk.io/ " target="_blank" rel="noopener noreferrer">https://tulsk.io/</a> (no sponsorship) </p>
                    <p>使用AI工具改善每天的工作管理: <a href="https://tulsk.io/ " target="_blank" rel="noopener noreferrer">https://tulsk.io/</a> (未贊助) </p>

                </div>
            )}
            <footer style={{ marginTop: '40px', padding: '10px', textAlign: 'center', fontSize: '12px', color: 'gray' }}>
                <p>This website is unofficial. Please refer to the official website <a href="https://rsvp.withgoogle.com/events/csj-tw-2024/" target="_blank" rel="noopener noreferrer">here</a> for more information.</p>
                <p>This programs starts from 2024年10月2日 下午1:30 to 2024年11月3日 下午11:59 [GMT+8]</p>
                <p>Manage this side project by using AI powered tool: <a href="https://tulsk.io/ " target="_blank" rel="noopener noreferrer">Tulsk.io</a> </p>
            </footer>
        </div>
    );
}