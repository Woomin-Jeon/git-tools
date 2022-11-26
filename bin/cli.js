#!/usr/bin/env node

'use strict'

const runner = async (params) => {
  const [command, ...options] =  params

  console.log(command)
}

runner(process.argv.slice(2))
