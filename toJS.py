#!/usr/bin/python3

import sys, getopt

def processFile(input_file, output_file):
    print ('converting:', input_file, 'to', output_file)
    commentNest = 0
    fin = open(input_file)
    fout = open(output_file, "wt")
    for line in fin:
        if line.find('global') >= 0 or line.find('import') >= 0:
            continue

        line = line.replace('\t', '    ')
        line = line.replace('elif', 'else if (')
        line = line.replace('else:', 'else {')
        line = line.replace('math.', 'Math.')
        line = line.replace('True', 'true')
        line = line.replace('False', 'false')
        line = line.replace('self', 'this')
        line = line.replace('def ', 'function ')
        line = line.replace('^#', '//')
        line = line.replace('# ', '// ')
        line = line.replace('):', ') {')
        line = line.replace('str(', 'String(')
        line = line.replace('(this, ', '(')
        line = line.replace('(this)', '()')
        line = line.replace('class ', 'function ')
        line = line.replace(':$', ') {')
        line = line.replace('return false', 'return false;')
        line = line.replace('return true', 'return true;')
        line = line.replace('Math.pi', 'Math.PI')
        line = line.replace('Math.e', 'Math.E')
        line = line.replace('type', 'typeof')
        line = line.replace('None', 'null')
        line = line.replace('.append', '.push)')
        line = line.replace('frame = simplegui', 'var frame = new simplegui')
        if line.find('"""') >= 0:
            if commentNest % 2 == 0:
                line = line.replace('"""', '/*')
            else:
                line = line.replace('"""', '*/')
            commentNest += 1
        fout.write(line)
    fin.close()
    fout.close()


def main(argv):
   inputfile = ''
   outputfile = ''
   try:
      opts, args = getopt.getopt(argv,"hi:o:",["ifile=","ofile="])
   except getopt.GetoptError:
      print ('toJS.py -i <inputfile> -o <outputfile>')
      sys.exit(2)
   for opt, arg in opts:
      if opt == '-h':
         print ('toJS.py -i <inputfile> -o <outputfile>')
         sys.exit()
      elif opt in ("-i", "--ifile"):
         inputfile = arg
      elif opt in ("-o", "--ofile"):
         outputfile = arg
   processFile(inputfile, outputfile);

if __name__ == "__main__":
   main(sys.argv[1:])

