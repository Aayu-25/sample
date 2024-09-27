
class SecureStreamingEntity {
  constructor() {}

  // Method to handle background task
  async backgroundTask(count) {
    if (count == 1) {
      // Simulate secure streaming logic
      const readableStream = createReadStream(join(__dirname, 'path_to_secure_streaming_file'));
      return "Hello";
    } else {
      return "Hi";
    }
  }
}


class HoppingEntity {
  constructor() {}

  // Method to simulate hopping
  async hopping(req, res) {
    // Simulate hopping by printing 'Hey' 20 times
    for (let i = 0; i < 20; i++) {
      console.log('Hey');
    }

    // Return a response to the client
    res.json({ message: 'Hopping completed successfully' });
  }
}


// Method to simulate the secure_streaming logic
async secureStreaming(req, res) {
  let count = 1;
  for (let i = 0; i < 10; i++) {
    const result = await this.backgroundTask(count);
    console.log(`Result : ${result}`);
    count++;
  }
  res.json({ message: 'Secure streaming completed successfully' });
}
