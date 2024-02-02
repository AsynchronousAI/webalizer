import traceback

available_disassemblers = {}


try:
  import capstone # try importing capstone.
  from .capstone import dis

  print ('Using Capstone backend.')
  available_disassemblers['capstone'] = dis
except ImportError as e:
  print (repr(e))
  traceback.print_exc()
  pass
except BaseException as e:
  print (repr(e))
  traceback.print_exc()

if len(available_disassemblers) == 0:
  print ('No available backend.')
