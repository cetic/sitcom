class BaseSearch
  STEP           = 10_000
  MAX_EXPANSIONS = 2147483647 # 2^31 - 1 (max value for ElasticSearch)

  attr_reader :params

  def initialize(params)
    @params = params
  end

  def run
    from    = 0
    results = []

    begin
      response = run_step(from)
      results += response.results.collect(&:_source)
      from     = from + STEP
    end while response.results.total > from

    results
  end
end
