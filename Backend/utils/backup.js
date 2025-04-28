import { exec } from 'child_process';

function backupDatabase() {
  const command = 'mongodump --host localhost --port 27017 --db MarketplaceFreelance --out "C:\\backups\\MarketplaceFreelance-backup"';

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error executing mongodump: ${stderr}`);
    } else {
      console.log(`Backup completed successfully: ${stdout}`);
    }
  });
}

// Call backup function
backupDatabase();
