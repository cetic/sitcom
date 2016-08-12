class BaseSearch
  STEP           = 30
  MAX_EXPANSIONS = 2147483647 # 2^31 - 1 (max value for ElasticSearch)

  attr_reader :params

  def initialize(params)
    @params = params
  end

  def run
    run_step.results.collect(&:_source)
  end
end
