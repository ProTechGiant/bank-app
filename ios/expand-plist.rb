#!/usr/bin/env ruby
# frozen_string_literal: true

require 'plist'
require 'dotenv'

def load_env(root_path)
  Dotenv.load(root_path)
end

def populate_plist(plist_file_path)
  plist_data = Plist.parse_xml(plist_file_path)

  # Iterate through each key-value pair in the plist
  plist_data.each do |key, value|
    # Check if the value is a string and contains a build variable placeholder
    if value.is_a?(String) && value.include?('$(')
      # Extract the build variable name from the placeholder
      build_variable = value.scan(/\$\((.*?)\)/).flatten.first

      # Check if the build variable exists in the environment
      if ENV.key?(build_variable)
        # Replace the placeholder with the value from the environment
        value.gsub!("$(#{build_variable})", ENV[build_variable])

        # Update the value in the plist
        plist_data[key] = value
      else
        raise "Could not expand variable #{build_variable} in file #{plist_file_path}"
      end
    end
  end

  # Save the modified plist file
  Plist::Emit.save_plist(plist_data, plist_file_path)
end

envs_input = ARGV[0]
config_output = ARGV[1]

load_env(envs_input)
populate_plist(config_output)

puts "Read .env from #{envs_input}/.env and expanded into #{config_output}"
