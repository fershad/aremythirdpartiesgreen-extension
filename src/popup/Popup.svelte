<script>
  import '../assets/css/index.css'

  let filteredUrls
  let resourceUrls
  let allDomains
  let currentDomain

  $: allDomains =
    [...new Set(resourceUrls?.map((resource) => new URL(resource.url).hostname))] || null

  const getActiveTab = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0]
      logNewResourceEntries(activeTab.id)
    })
  }

  const greenCheck = async (resource) => {
    const response = await fetch(`https://api.aremythirdpartiesgreen.com/url/${resource.url}`)
    try {
      const data = await response.json()
      return {
        resource,
        data,
        green: data.results[0].green,
        domain: new URL(resource.url).hostname,
      }
    } catch (error) {
      return { resource, data: 'error', green: false, domain: new URL(resource.url).hostname }
    }
  }

  const logNewResourceEntries = async (tabId) => {
    const tab = await chrome.tabs.get(tabId)
    const currentHost = new URL(tab.url).hostname
    currentDomain = currentHost
    // Use the performance timing API to get all the loaded resources from the active tab
    const resourceEntries = await chrome.scripting.executeScript({
      target: { tabId },
      function: () => {
        const resourceEntries = performance.getEntriesByType('resource')
        return resourceEntries.map((entry) => ({
          url: entry.name,
          type: entry.initiatorType,
        }))
      },
    })

    resourceUrls = resourceEntries[0].result
    // Filter out the current host from the list of resources and remove duplicates
    filteredUrls = Promise.all(
      [...new Set(resourceUrls)]
        .filter((resource) => new URL(resource.url).hostname !== currentHost)
        .map((resource) => greenCheck(resource)),
    ).then((values) => values)
  }

  function overallGreen(domain, urls) {
    const relevantDomains = urls.filter((url) => url.domain === domain)
    const greenDomains = relevantDomains.filter((url) => url.green)
    const greenDomainsCount = greenDomains.length
    const totalDomainsCount = relevantDomains.length
    const percentage = Math.round((greenDomainsCount / totalDomainsCount) * 100)
    if (percentage === 100) {
      return 'Uses green web hosts'
    } else if (percentage === 0) {
      return 'Does not use green web hosts'
    } else {
      return 'Uses some green web hosts'
    }
  }

  function overallGreenCount(domain, urls) {
    const relevantDomains = urls.filter((url) => url.domain === domain)
    const greenDomains = relevantDomains.filter((url) => url.green)
    const greenDomainsCount = greenDomains.length
    const totalDomainsCount = relevantDomains.length
    return `${greenDomainsCount} of ${totalDomainsCount} green ${
      totalDomainsCount > 1 ? 'domains' : 'domain'
    }`
  }
</script>

<main>
  <section id="intro" class="flow">
    <div class="text-center">
      <h2>Are my third parties green?</h2>
      <p class="subtag">Check the third party resources used by a website.</p>
    </div>
  </section>
  {#await allDomains}
    <button class="cta" on:click={() => getActiveTab()}>Check page</button>
  {:then domains}
    {#if domains?.length > 0}
      <h3>Summary</h3>
      <section id="summary" class="flow highlight">
        <div class="content">
          <div class="flex-row">
            <div class="block">
              <p>Total requests</p>
              <div>
                <p class="emphasis">
                  {#await resourceUrls}
                    Awaiting results ...
                  {:then allUrls}
                    <!-- promise was fulfilled -->
                    {allUrls?.length} requests
                  {/await}
                </p>
              </div>
            </div>
            <div class="block">
              <p>Third-party requests</p>
              <div>
                <p class="emphasis">
                  {#await filteredUrls}
                    Awaiting results ...
                  {:then filtered}
                    <!-- promise was fulfilled -->
                    {filtered?.length} requests ({Math.round(
                      (filtered?.length / resourceUrls?.length) * 100,
                    )}%)
                  {/await}
                </p>
              </div>
            </div>
            <div class="block">
              <p>Green third-party requests</p>
              <div>
                <p class="emphasis">
                  {#await filteredUrls}
                    Awaiting results ...
                  {:then filtered}
                    <!-- promise was fulfilled -->
                    {filtered?.filter((url) => url.green).length} requests ({Math.round(
                      (filtered?.filter((url) => url.green).length / filtered?.length) * 100,
                    )}%)
                  {/await}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h3>Request summary</h3>
        <aside id="legend" class="flow highlight small-side">
          <h4 class="heading">Legend</h4>
          <ul>
            <li>
              <span aria-label="Uses green web hosts" class="green" />
              All green hosts
            </li>
            <li>
              <span aria-label="Uses some green web hosts" class="mixed" />
              Some green hosts
            </li>
            <li>
              <span aria-label="Does not use green web hosts" class="grey" />
              No green hosts
            </li>
          </ul>
        </aside>
        {#each domains as domain}
          {#if domain !== currentDomain}
            <!-- content here -->
            {#await filteredUrls then urls}
              <details>
                <summary
                  ><span class="summary"
                    ><span aria-label={overallGreen(domain, urls)} />
                    <div class="summary-group">
                      <span class="url">{domain}</span>
                      <small>{overallGreenCount(domain, urls)}</small>
                    </div>
                  </span>
                </summary>
                {#each urls as url}
                  {#if url.domain === domain}
                    <span class="url-summary"
                      ><span
                        aria-label={url?.green
                          ? 'Uses green web hosts'
                          : 'Does not use green web hosts'}
                        class={url?.green ? 'green' : 'grey'}
                      />
                      <div class="url-wrapper">
                        <div>
                          <span class="url">{url.resource.url}</span>
                        </div>
                      </div></span
                    >
                  {/if}
                {/each}
              </details>
            {/await}
          {/if}
        {/each}
      </section>
      <button class="cta" on:click={() => getActiveTab()}>Check page again</button>
    {:else}
      <button class="cta" on:click={() => getActiveTab()}>Check page</button>
    {/if}
  {/await}
</main>
<footer>
  <div class="text-center flow">
    <p>Are my parties green?</p>
    <ul>
      <li>
        <a href="https://aremythirdpartiesgreen.com" rel="noopener" target="_blank">Website</a>
      </li>
      <li>
        <a href="https://aremythirdpartiesgreen.com/directory" rel="noopener" target="_blank"
          >Directory</a
        >
      </li>
      <li>Found a bug?</li>
    </ul>
    <small>
      Made in 🇹🇼 by <a href="https://www.fershad.com" rel="noopener" target="_blank"
        >Fershad Irani</a
      >.
    </small>
  </div>
</footer>

<style>
  #intro {
    width: 100%;
    height: 100%;
    max-width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: var(--size-7);
    margin-top: var(--size-9);
    /* --flow-space: var(--size-7); */
  }

  footer {
    /* border-top: 2px solid var(--secondary-color); */
    padding: var(--size-4) 0;
    position: relative;
    /* margin-top: var(--size-9); */
  }

  p:first-of-type {
    margin-top: var(--size-3);
  }

  ul {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: var(--size-5);
    padding: 0;
    justify-content: center;
    align-items: center;
    margin-top: 0;
  }

  li {
    margin: 0;
    flex: 1 1 auto;
  }

  .wrapper {
    justify-items: center;
  }

  .text-center > p {
    width: 100%;
  }

  .summary-group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    text-align: left;
  }

  .url-summary {
    display: grid;
    width: fit-content;
    max-width: 100%;
    gap: 1rem;
    align-items: center;
    justify-content: start;
    grid-template-columns: 2ex 1fr;
  }

  :global(body) {
    min-width: 34rem;
    margin: 0;
  }

  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }

  .emphasis {
    font-size: 1.25rem;
  }

  .cat-nav ul li {
    margin-block: var(--size-2);
  }

  h2 {
    font-size: 140%;
  }

  h3 {
    font-size: 115%;
  }

  #summary {
    max-width: 100vw;
    width: 100%;
    overflow: hidden;
    display: flex;
    gap: var(--size-3);
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }

  details {
    background-color: var(--gray-8);
    color: var(--text-color);
    border: 1.5px solid var(--background-color);
  }

  details > summary {
    display: flex;
    justify-content: flex-start;
    gap: var(--size-6);
    background-color: var(--gray-7);
    color: var(--text-color);
    overflow: auto;
  }

  .url-wrapper {
    max-width: 100%;
    overflow: auto;
    scrollbar-width: 0.25rem;
    scrollbar-color: var(--secondary-color) var(--yellow-0);
  }

  .url {
    max-width: 100%;
    white-space: nowrap;
  }

  .summary {
    transition: all 0.15s ease-in-out;
    display: flex;
    align-items: center;
    gap: var(--size-4);
    width: fit-content;
  }

  .summary > .green,
  #legend .green {
    width: 2ex;
    height: 2ex;
    border-radius: 50%;
    background: var(--green-3);
    border: 1px solid var(--green-0);
    display: inline-block;
  }

  .summary > .grey,
  #legend .grey {
    width: 2ex;
    height: 2ex;
    /* border-radius: 50%; */
    background: var(--yellow-3);
    border: 1px solid var(--yellow-0);
    display: inline-block;
  }

  [aria-label='Uses green web hosts'],
  #legend .green {
    width: 2ex;
    height: 2ex;
    border-radius: 50%;
    background: var(--green-3);
    border: 1px solid var(--green-0);
    display: inline-block;
  }

  [aria-label='Does not use green web hosts'],
  #legend .grey {
    width: 2ex;
    height: 2ex;
    /* border-radius: 50%; */
    background: var(--yellow-3);
    border: 1px solid var(--yellow-0);
    display: inline-block;
  }

  [aria-label='Uses some green web hosts'],
  #legend .mixed {
    width: 2ex;
    height: 1ex;
    background: var(--green-3);
    border: 1px solid var(--yellow-0);
    display: inline-block;
    border-top-left-radius: calc(1ex + 1px);
    border-top-right-radius: calc(1ex + 1px);
    border-bottom: 0;
  }

  #legend ul {
    font-size: var(--body-fluid-size-small);
    display: flex;
    list-style: none;
    gap: var(--size-4);
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    padding-inline-start: 0;
  }

  #legend ul li {
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    gap: var(--size-2);
  }

  #legend {
    position: sticky;
    top: 0;
    left: 0;
    z-index: 99;
    background-color: var(--background-color);
  }

  section:last-of-type {
    margin-bottom: var(--size-8);
  }
</style>
