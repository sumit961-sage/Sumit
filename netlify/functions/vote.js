exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { choice, ip, time, userAgent } = JSON.parse(event.body);
  
  // Your Telegram credentials (set in Netlify environment variables)
  const BOT_TOKEN = process.env.BOT_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;
  
  // Simple in-memory store (resets on cold start, but good enough)
  // For persistent storage, we'd need a database
  const votedIPs = global.votedIPs || new Set();
  global.votedIPs = votedIPs;
  
  // Check if IP already voted
  if (votedIPs.has(ip)) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'Already voted', ip: ip })
    };
  }
  
  // Record vote
  votedIPs.add(ip);
  
  // Send Telegram notification
  const message = `💝 SUSHANA VOTED! 💝\n\nChoice: ${choice.toUpperCase()}\nIP: ${ip}\nTime: ${time}\nDevice: ${userAgent.slice(0, 100)}\n\nTotal unique votes: ${votedIPs.size}`;
  
  try {
    await fetch(`https://api.telegram.org/bot${8020795137:AAE0gRSKNzEYyMqX-1z3BfhP20ZTKxErxlg}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: 6725939012,
        text: message,
        parse_mode: 'HTML'
      })
    });
    
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, ip: ip })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send notification' })
    };
  }
};
