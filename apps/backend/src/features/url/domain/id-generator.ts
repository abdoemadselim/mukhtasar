import urlRepository from "#features/url/data-access/url.repository.js";
let batch_start_id = -1;
let local_counter = 0;
const batch_size = 500

async function get_new_batch() {
    let { batch_start } = await urlRepository.getIdBatch(batch_size);
    batch_start_id = Number(batch_start);
}

// It works by fetching a batch of ids from DB with the defined batch_size
// That improves performance by skipping the db query for each new URL to get a new ID
// Only after consuming all the IDs, a request is sent to DB to fetch another batch
// All the logic is abstracted inside this function
export default async function generate_id(): Promise<number> {
    // Get a new batch when all the id batch is consumed, or when the machine just restarts
    if (batch_start_id == -1 || local_counter == batch_size) {
        await get_new_batch();
        local_counter = 0;
    }

    // Update local counter, so no need to call DB
    let current_id = batch_start_id + local_counter;
    local_counter++

    // Why machine_id? So it's easier to scale out by adding more machines
    // For distributed system, a new server with defined MACHINE_ID (e.g 1, 2) is added
    // A DB server shard is created (each server --talks to --> it's relative DB shard)
    return (Number(process.env.MACHINE_ID) || 0) + current_id;
}